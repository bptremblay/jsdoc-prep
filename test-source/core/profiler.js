/**
 * The Class Logger. Implementation-independent logging interface.
 *
 * @author btremblay
 * @version 1.0
 * @created 25-Apr-2013 3:33:12 PM
 */

define('profiler', [], function() {
  //

  var profiler = new Object();
  var profiler_averages = false;
  var instance = null;

  function setSpanOffset(n) {
    profiler.spanOffset = n;
  }

  function startProfile(label) {
    if (profiler.spanOffset == null) {
      profiler.spanOffset = 0;
    }

    if (profiler[label] == null) {
      profiler[label] = new Object();
      profiler[label].count = 0;
      profiler[label].spans = new Array();
    }

    if (profiler[label].running == true) {
      stopProfile(label);
    }

    profiler[label].start = new Date().getTime();
    profiler[label].stop = null;
    profiler[label].running = true;
  }

  function stopProfile(label) {
    if (profiler[label] != null) {
      profiler[label].stop = new Date().getTime();
      profiler[label].count++;
      profiler[label].running = false;
      var span = (profiler[label].stop - profiler[label].start);
      profiler[label].spans.push(span);
    }
  }

  function avgSpan(spans) {
    var temp = 0;
    var i = 0;

    for (i = 0; i < spans.length; i++) {
      temp += spans[i];
      temp = (temp - profiler.spanOffset);
    }

    temp = Math.floor(temp / spans.length);
    return temp;
  }

  var profileTimer = 0;

  function initProfile() {
    profiler = new Object();
    profiler.spanOffset = 0;
  }

  var oldReport = '';

  function displayProfiles() {
    //top.LOGGER.setWriteLog(true);

    if (profileTimer > 0) {
      window.clearTimeout(profileTimer);
      profileTimer = 0;
    }

    var output = 'PROFILER REPORT\n';
    var empty = true;

    for (var p in profiler) {
      var profile = profiler[p];

      if (profile.stop != null) {
        if (profiler_averages == true) {
          var avg = avgSpan(profile.spans);
          output += '[' + p + ']' + ':' + profile.count + ' times@' + (avg)
            + 'ms  \n';
        } else {
          var lastSpan = (profile.stop - profile.start);
          output += '[' + p + ']' + ':' + (lastSpan) + 'ms  \n';
        }

        empty = false;
      }
    }

    output += ' * * * * * * * * * * ';

    if (empty == false) {
      if (oldReport != output) {
      }

      oldReport = output;
    } else {
      output = '';
    }

    profiler = new Object();
    // top.LOGGER.setWriteLog(top.CUSTOMIZATION.getProperty("DEBUG"));
    return output;
  }

  /**
   * Get instance.
   *
   * @memberOf {Logger}
   * @method getInstance
   * @private
   * @return {Logger}
   */

  function getInstance() {
    if (instance === null) {
      instance = {};
      instance.initProfile = initProfile;
      instance.startProfile = startProfile;
      instance.stopProfile = stopProfile;
      instance.displayProfiles = displayProfiles;
    }

    if (window.wf == null) {
      window.wf = {};
    }
    window.wf.Profiler = instance;
    return instance;
  }

  return getInstance();
});
