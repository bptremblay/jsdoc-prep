define([
  'jquery',
  'underscore',
  'backbone',
  'immutable',
  'image-editor-basic-path/constants',
  'image-editor-basic-path/lib/image-helpers',
  'galileo-lib/modules/services/url-validator-service',
  'galileo-lib/modules/services/usage-tracking',
  'galileo-lib/modules/services/customer-service',
  'galileo-lib/modules/services/placeholder-service'
], function($, _, Backbone, Immutable, constants, imageHelpers, UrlValidator, usageTracking,
    customerService, placeholderService) {

  // Shared Image State - Basic & Canvas Image Editor - v2.0.0
  //
  //  * height - number
  //  * width - number
  //  * imageUrl - string
  //  * imageAlt - string
  //  * imageWidth - number (new)
  //  * imageHeight - number (new)
  //  * maxWidth - number
  //  * magnification - number
  //  * linkType - string
  //  * link - object or null
  //     * href - string
  //     * track - string
  //  * source - string
  //  * offsetX - number [not used in the Basic Image Editor]
  //  * offsetY - number [not used in the Basic Image Editor]
  //  * cdnUrl - string [not used in the Basic Image Editor]
  //
  // This state version can not be migrated to.  It requires the image be loaded
  // to determine its dimensions.  Compatible with State 2.0.0

  // Customer Service Helpers
  let hasLogo = function(service) {
    let logo = service.getLogo();
    return Immutable.Map.isMap(logo) && logo.get('url');
  };

  let getLogo = function(service) {
    let map = {
      url: 'imageUrl',
      width: 'imageWidth',
      height: 'imageHeight',
      altText: 'imageAlt'
    };

    return service.getLogo()
      .filter((value, key) => _(map).keys().includes(key)) // filter down to map keys
      .mapKeys((key, value) => map[key]) // mutate keys
      .toJS(); // return a JS object
  };

  class StateModel extends Backbone.Model {
    static initClass() {

      this.prototype.defaults = {
        name: '',
        type: '',
        imageType: '',
        imageUrl: '',
        externalUrl: '',
        imageAlt: '',
        imageWidth: 0,
        imageHeight: 0,
        maxWidth: null,
        link: null,
        linkType: 'web',
        source: null,
        width: 0,
        height: 0,
        magnification: 1,
        offsetX: 0,
        offsetY: 0,
        cdnUrl: null,
        container: {},
        image: {
          hasHeight: false
        }
      };

      // These attributes are not serialized into the state saved by the platform
      this.prototype.editorAttributes = ['dragHover', 'maxWidth'];
    }

    initialize(attrs, options) {
      this._transformImageUrlToEntity();
      return this.eventEmitter = options.eventEmitter;
    }

    validate(attrs, options) {
      if (__guard__(attrs.link, x => x.href)) {
        let urlValidator = new UrlValidator(attrs.link.href);

        if (!urlValidator.isValid()) {
          return urlValidator.getError();
        }
      }
    }

    getError() {
      if (!this.isValid()) {
        return this.validationError;
      }
    }

    // Sets the link and applys the user affordance of inserting a http:// or
    // mailto: when omitted
    setLink(val) {
      if (!val) {
        this.set('link', null);
        return;
      }

      if (/^.+:/.test(val)) {
        return this.set('link', {href: val, track: 'on'});
      } else if (/^[\w\.-]+@[\w\.-]+\.\w+/.test(val)) {
        return this.set('link', {href: `mailto:${val}`, track: 'on'});
      } else {
        return this.set('link', {href: `http://${val}`, track: 'on'});
      }
    }

    getLink() {
      if (this.get('link') && this.get('link').href) {
        return this.get('link').href;
      } else {
        return null;
      }
    }

    getLinkType() {
      return this.get('linkType');
    }

    setLinkType(linkType) {
      return this.set('linkType', linkType);
    }

    // Converts the model to an object for rendering
    // @return [Object]
    toContext() {
      let context =
        {link: this.getLink()};

      // Use customer data?
      if (this.isPlaceholderImage() && this.isLogo() && hasLogo(customerService)) {
        _(context).extend(getLogo(customerService));
      } else {
        _(context).extend(this._toImageContext());
      }

      // Calculate image fit
      if (!imageHelpers.isVariableImage(context.imageUrl)) {
        let magnification = this._getMagnificationForContext(context);
        context.width = Math.ceil(context.imageWidth * magnification);
        context.height = Math.ceil(context.imageHeight * magnification);
      } else {
        context.width = context.imageWidth;
        context.height = context.imageHeight;
      }
      return context;
    }

    // Converts the model to an object for rendering image views
    // @return [Object]
    toImageViewRenderingContext() {
      let context = this.toContext();

      return {
        name: this.get('name'),
        type: this.get('type'),
        container: this.get('container'),
        link: this.get('link'),
        image: {
          type: this.get('imageType'),
          url: context.imageUrl,
          alt: context.imageAlt,
          width: context.width,
          height: context.height,
          hasHeight: this.get('image').hasHeight,
          class: this.get('image').class,
          style: this.get('image').style
        }
      };
    }

    _toImageContext() {
      let context = this.pick('imageWidth', 'imageHeight', 'imageAlt');
      context.imageUrl = this.getImageUrlForEdit();
      return context;
    }

    _getMagnificationForContext(context) {
      return imageHelpers.fitMagnification(
        context.imageWidth,
        context.imageHeight,
        this.get('width'),
        this.get('height')
      );
    }

    // Whether this editor is display default content (either a placeholder, or an unset logo)
    isDefaultContent() {
      if (this.isLogo()) {
        return !this.getLogoUrl() && this.isPlaceholderImage();
      } else {
        return this.isPlaceholderImage();
      }
    }

    isPlaceholderImage() {
      let resolvedUrl = this.getImageUrlForEdit();
      return imageHelpers.isPlaceholderImage(resolvedUrl);
    }

    isLogo() {
      return this.getImageType() === 'logo-image';
    }

    getLogoUrl() {
      return hasLogo(customerService);
    }

    getEditorName() {
      return this.get('name');
    }

    getEditorType() {
      return this.get('type');
    }

    getImageType() {
      return this.get('imageType');
    }

    toDescriptor(editor, layoutEditor) {
      let json = this.toJSON();

      let descriptor = {
        name: editor.name,
        layoutInstanceId: __guardMethod__(layoutEditor, '_getInstanceId', o => o._getInstanceId()),
        src: json['imageUrl'],
        alt: json['imageAlt'],
        width: json['imageWidth'],
        height: json['imageHeight'],
        isMove: true
      };

      if (this.hasLink()) {
        descriptor['link'] = this.getLink();
      }

      // TODO: VN-5961 Hack to enable moving of logos
      if (this.getImageType()) {
        descriptor['imageType'] = this.getImageType();
      }

      return descriptor;
    }

    // Updates the state model image.
    // @return [Deferred]
    setImage(imageData) {
      let externalUrl = '';
      if (imageData.externalUrl && !imageHelpers.hasStaleExternalUrl(imageData)) {
        externalUrl = imageHelpers.makeHttps(imageData.externalUrl);
      }
      this.set({
        imageUrl: imageData.src,
        imageAlt: imageData.alt,
        externalUrl
      });
      this._transformImageUrlToEntity();

      if (imageData.width && imageData.height) {
        this.set({imageWidth: imageData.width, imageHeight: imageData.height});

      } else {
        // Clear out any existing dimensions
        this.set({imageWidth: null, imageHeight: null});
      }

      if (imageData.source) { this.set({source: imageData.source}); }
      return $.when(this.setMagnification());
    }

    // Resize the image well
    resizeWell(dimensions) {
      return this.set({width: dimensions.width, height: dimensions.height});
    }

    setMaxWidth(maxWidth) {
      this.set({maxWidth});
      return this.eventEmitter.trigger(constants.EVENTS.MAX_WIDTH_SET, maxWidth);
    }

    // Limits the width of the image to the widthLimit
    // @return [Boolean] True if the image width has be limited
    limitImageWidth(widthLimit) {
      let currentWidth = this.get('width');
      let currentHeight = this.get('height');
      if (currentWidth <= widthLimit) { return false; }

      let limitedDimensions = {
        width: widthLimit,
        height: currentHeight * (widthLimit / currentWidth)
      };

      this.resizeWell(limitedDimensions);
      return true;
    }

    // The magnification is the ratio between the image size and the well size.
    // In the Basic Image Editor all images are sized to 'fit'. If the width and
    // height are known the magnification is set and the deferred is resolved.
    // Otherwise the image is loaded and the width and the height are set.
    //
    // Required for compatability with layout carousel and state that does not
    // have image dimensions set.
    //
    // @return [Promise]
    setMagnification() {
      if (!this.get('imageWidth') || !this.get('imageHeight')) {
        var deferred = this._setImageDimensions();
      } else {
        var deferred = $.Deferred().resolve();
      }

      return deferred.done(() => {
        return this._setMagnification();
      }
      );
    }

    // Calculate magnification once all attributes are known
    _setMagnification() {
      return this.set({magnification: imageHelpers.fitMagnification(
        this.get('imageWidth'), this.get('imageHeight'), this.get('width'), this.get('height')
      )
      });
    }

    _setImageDimensions() {
      let deferred = $.Deferred();
      if (this.hasImageUrl() && !this._imageUrlIsPassthroughEntity()) {
        let img = new Image();
        img.onload = () => {
          let imageDimensions = imageHelpers.getImageDimensions(img);
          this.set({
            imageWidth: imageDimensions.width,
            imageHeight: imageDimensions.height
          });
          return deferred.resolve();
        };
        img.src = this.getImageUrlForEdit();
        // Avoid stalling the editor if the image fails to load within 5 seconds
        setTimeout(() => deferred.resolve()
         , 5000);
      } else {
        this.set({
          imageWidth: this.get('width'),
          imageHeight: this.get('height')
        });
        deferred.resolve();
      }

      return deferred;
    }

    hasLink() {
      return (__guard__(this.get('link'), x => x.href) != null) && this.get('link').href !== '';
    }

    triggerImageOverlay() {
      return this.eventEmitter.trigger(constants.EVENTS.SET_IMAGE_HOVER);
    }

    triggerRemoveImageOverlay() {
      return this.eventEmitter.trigger(constants.EVENTS.REMOVE_IMAGE_HOVER);
    }

    setReplaceImageHover(value) {
      this.set({replaceImageHover: value});
      return this.eventEmitter.trigger(constants.EVENTS.REPLACE_IMAGE_HOVER);
    }

    hasReplaceImageHover() {
      return !!this.get('replaceImageHover');
    }

    toPlatformState() {
      let platformState = this.toJSON();
      platformState.imageUrl = this.getImageUrlForState();
      this.editorAttributes.forEach(attribute => delete platformState[attribute]);

      return platformState;
    }

    setState(newState) {
      this.set(newState);
      return this._transformImageUrlToEntity();
    }

    getImageUrlForEdit() {
      return this.imageUrlEntity.valueForEditAttribute();
    }

    getImageUrlForState() {
      return this.imageUrlEntity.valueForState();
    }

    hasImageUrl() {
      return this.getImageUrlForEdit() !== '';
    }

    setImageUrl(url) {
      this.set({imageUrl: url});
      return this._transformImageUrlToEntity();
    }

    _transformImageUrlToEntity() {
      let imageUrl = this.get('imageUrl') || '';
      this.unset('imageUrl');
      return this.imageUrlEntity = placeholderService.lookup(imageUrl);
    }

    _imageUrlIsPassthroughEntity() {
      let isVariable = imageHelpers.isVariableImage(this.getImageUrlForEdit());
      let isPassthrough = this.getImageUrlForState() === this.getImageUrlForEdit();
      return isVariable && isPassthrough;
    }
  }
  return StateModel.initClass();
});

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}
