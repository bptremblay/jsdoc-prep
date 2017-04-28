import ComponentFactory from './component-factory';
import $ from './lib/jquery';
import DocumentService from './document-service';

let documentData = null;

function report(msg) {
  if (msg) {
    msg = '[' + new Date().getTime() + ']' + ' ' + msg;
    msg = '<xmp>' + msg + '</xmp>';
    var text = $('#report').html();
    if (text) {
      $('#report').html(text + '\n' + msg);
    } else {
      $('#report').html(msg);
    }
    $('#report').scrollTop(100000);
  } else {
    $('#report').html('');
  }
}


function main() {
  report('hello');
  var cf = new ComponentFactory();
  cf.setDomParent($('#harness'));

  DocumentService.get('sample').then(function (documentData, error) {

    let shellLayout = documentData.template.files.shell;
    let templateLayout = documentData.template.files.layout;
    let columnLayout = documentData.template.files.col;

    let templateA = documentData.template.files.button;
    let templateB = documentData.template.files.image;
    let templateC = documentData.template.files.social;
    let templateD = documentData.template.files.text;

    let comp = null;
    let col = null;

    let shell = null;
    let layout = null;

    // Create the shell
    shell = cf.createComponent(documentData, 'template.components.shell', shellLayout.html);

    // Create the first layout
    layout = cf.createComponent(documentData, 'template.components.layout', templateLayout.html, shell);
    // Create the first col in the first layout
    col = cf.createComponent(documentData, 'template.components.col', columnLayout.html, layout);
    // make 50% width
    col.setProperty('width', '50%');
    // Create a button
    comp = cf.createComponent(documentData, 'template.components.button', templateA.html, col);
    // Create the second col in the first layout
    col = cf.createComponent(documentData, 'template.components.col', columnLayout.html, layout);
    // make 50% width
    col.setProperty('width', '50%');
    // Create an image
    comp = cf.createComponent(documentData, 'template.components.image', templateB.html, col);

    // Create the second layout
    layout = cf.createComponent(documentData, 'template.components.layout', templateLayout.html, shell);
    // Create the shared col in the second layout
    col = cf.createComponent(documentData, 'template.components.col', columnLayout.html, layout);
    // Create some text
    comp = cf.createComponent(documentData, 'template.components.text', templateD.html, col);
    // Create a social bar below
    comp = cf.createComponent(documentData, 'template.components.social', templateC.html, col);


    cf.render();
  });

}

main();

export default ComponentFactory;
