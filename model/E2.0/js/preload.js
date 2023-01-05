
require.config({
    urlArgs: "t=" +  "20200309",
    baseUrl:"E2.0/js",
    paths: {
        tween:'plugin/tween.min',
        // animationHandler:'libs/AnimationHandler',
        lib:'libs/lib'
    }

});
var ldDb=false,ldSc=false,ldScBg=false,ldScGl=false,ldScAni=false;
var enablebg,_composer,_mirror,_matcap,waterMaterial;
var dataBaseO,animationData,sceneFile,sceneGlobalFile,sceneBGFile;
var sMusic = $("#music")[0];
var sIframeContent = $('.iframeContent');
var sButList = $("#butList");
var sButSwitch = $("#butSwitch");
var editor = {};
var eventObj = {};
require(['tween','lib'], function() {
    var loader = new THREE.XHRLoader;
    var cfg = [ ];
    loader.load(dataBaseFilePath, function (text) {
        dataBaseO = JSON.parse(text);
        for (var i in dataBaseO.labels) {
            var p = dataBaseO.labels[i];
            if (p.image) {
                if (p.image.image_pc) {
                    dataBaseO.labels[i].image.image_pc.image = p.image.image_pc.image.replace(/^(.*)\/Uploads/, "Uploads");
                }
                if (p.image.image_mobile) {
                    dataBaseO.labels[i].image.image_mobile.image = p.image.image_mobile.image.replace(/^(.*)\/Uploads/, "Uploads");
                }
            }
            if(p.frequency){
                if(p.frequency.src){

                }
            }
        }
        for (var i in dataBaseO.labels3d) {
            var p = dataBaseO.labels3d[i];
            if (p.image) {
                dataBaseO.labels3d[i].image.image = p.image.image.replace(/^(.*)\/Uploads/, "Uploads");
            }
        }
        for (var i in dataBaseO.personal) {
            var p = dataBaseO.personal[i];
            if (p.PartsImg) {
                dataBaseO.personal[i].PartsImg = p.PartsImg.replace(/^(.*)\/Uploads/, "Uploads");
            }
            for (var j = 0, len = p.MapArray.length; j < len; j++) {
                dataBaseO.personal[i].MapArray[j] = p.MapArray[j].replace(/^(.*)\/Uploads/, "Uploads");
            }
        }
        for (var i = 0, len = dataBaseO.skyboxArr.length; i < len; i++) {
            for (var j = 0; j < 6; j++) {
                dataBaseO.skyboxArr[i][j] = dataBaseO.skyboxArr[i][j].replace(/^(.*)\/Uploads/, "Uploads");
            }
        }
        for (var i in dataBaseO.Mirror) {
            var p = dataBaseO.Mirror[i];
            dataBaseO.Mirror[i].diffuseSampler = p.diffuseSampler.replace(/^(.*)\/Uploads/, "Uploads");
        }
        for (var i in dataBaseO.matcap) {
            var p = dataBaseO.matcap[i];
            dataBaseO.matcap[i].tMatCap = p.tMatCap.replace(/^(.*)\/E2.0/, "E2.0");
            if (p.tNormal) {
                dataBaseO.matcap[i].tNormal = p.tNormal.replace(/^(.*)\/E2.0/, "E2.0");
            }
        }
        // if (dataBaseO.music.src) {
        //     dataBaseO.music.src = dataBaseO.music.src.replace(/^(.*)\/Uploads/, "Uploads");
        // }
        _composer = dataBaseO.composer.DarkNight || dataBaseO.composer.WhiteCurtain || dataBaseO.composer.Restoring || dataBaseO.composer.Restoring || dataBaseO.composer.Pixel || dataBaseO.composer.Luminous;
        enablebg = dataBaseO.background.enable2D;
        _mirror = Object.size(dataBaseO.Mirror);
        _matcap = Object.size(dataBaseO.matcap);
        _waterMaterial = Object.size(dataBaseO.waterMaterial);





        ldDb = true;
        loadTest();
    });
    loader.load(animationFilePath, function (text) {
        if (text == "") {
            text = "[]";
        }
        animationData = JSON.parse(text);

        ldScAni = true;
        loadTest();
    });
    loader.load(sceneFilePath, function (text) {
        sceneFile = JSON.parse(text);
        for (var i = 0, len = sceneFile.images.length; i < len; i++) {
            sceneFile.images[i].url = sceneFile.images[i].url.replace(/^(.*)\/Uploads/, "Uploads");
            sceneFile.images[i].url = sceneFile.images[i].url.replace(/^(.*)\/E2.0/, "E2.0");
        }
        for (var i = 0, len = sceneFile.geometries.length; i < len; i++) {
            if (sceneFile.geometries[i].path) {
                sceneFile.geometries[i].path = sceneFile.geometries[i].path.replace(/^(.*)\/Uploads/, "Uploads");
            }
        }
        ldSc = true;
        loadTest();
    });
    loader.load(sceneBGFilePath, function (text) {
        sceneBGFile = JSON.parse(text);
        for (var i = 0, len = sceneBGFile.images.length; i < len; i++) {
            sceneBGFile.images[i].url = sceneBGFile.images[i].url.replace(/^(.*)\/Uploads/, "Uploads");
            sceneBGFile.images[i].url = sceneBGFile.images[i].url.replace(/^(.*)\/E2.0/, "E2.0");
        }
        ldScBg = true;
        loadTest();
    });
    loader.load(sceneGlobalFilePath, function (text) {
        sceneGlobalFile = JSON.parse(text);
        for (var i = 0, len = sceneGlobalFile.images.length; i < len; i++) {
            sceneGlobalFile.images[i].url = sceneGlobalFile.images[i].url.replace(/^(.*)\/Uploads/, "Uploads");
            sceneGlobalFile.images[i].url = sceneGlobalFile.images[i].url.replace(/^(.*)\/E2.0/, "E2.0");
        }
        ldScGl = true;
        loadTest();
    });

    function loadTest() {
        if (ldDb && ldSc && ldScBg && ldScGl && ldScAni) {
            require(cfg, function () {
                require(["app"], function () {
                    function cycleClear() {
                        try {
                            var el = document.getElementById("iframelink");
                            if (el) {
                                el.contentWindow.document.write("");
                                el.contentWindow.document.clear();
                                el.src = "about:blank";
                                window.history.back();
                            }
                        } catch (e) {
                        }
                    }

                    $(".iframe_close ").click(function () {
                        $(".maskdiv").toggle();
                        sIframeContent.toggle();
                        if (dataBaseO.controls.type == "2") {
                            controls.enabled = true;
                        }
                        cycleClear();
                        if (enablebg) {
                            rAF = requestAnimationFrame(animate1);
                        } else {
                            rAF = requestAnimationFrame(animate2);
                        }
                        if (sMusic.src) {
                            sMusic.play();
                        }
                    });
                    $("#enter").click(function () {
                        sIframeContent.css("position", "absolute").css("width", "90%").css("height", "70%");
                        $(".enter").toggle();
                        $(".maskdiv").toggle();
                        sIframeContent.toggle();
                        document.getElementById("iframelink").src = "http://";
                        if (sMusic.src) {
                            sMusic.play();
                        }
                    });
                    if (sMusic.src) {
                        sMusic.play();
                    }
                    if (mobileDevice) {
                        $("html").one("touchstart", function () {
                            if (sMusic.src) {
                                sMusic.play();
                            }
                        });
                        $("body").one("touchstart", function () {
                            if (sMusic.src) {
                                sMusic.play();
                            }
                        });
                    }
                    document.addEventListener("fullscreenchange", function () {
                        test();
                    }, false);
                    document.addEventListener("mozfullscreenchange", function () {
                        test();
                    }, false);
                    document.addEventListener("webkitfullscreenchange", function () {
                        test();
                    }, false);
                    document.addEventListener("MSFullscreenChange", function () {
                        test();
                    }, false);
                    window.addEventListener("resize", onWindowResize, false);
                    var viewFullScreen = document.getElementById("fullbut");
                    if (viewFullScreen) {
                        viewFullScreen.addEventListener("click", function () {
                            var docElm = document.getElementById("viewport");
                            if (docElm.requestFullscreen) {
                                docElm.requestFullscreen();
                            } else if (docElm.msRequestFullscreen) {
                                docElm.msRequestFullscreen();
                            } else if (docElm.mozRequestFullScreen) {
                                docElm.mozRequestFullScreen();
                            } else if (docElm.webkitRequestFullScreen) {
                                docElm.webkitRequestFullScreen();
                            }
                        }, false);
                    }
                    var cancelFullScreen = document.getElementById("nofull");
                    if (cancelFullScreen) {
                        cancelFullScreen.addEventListener("click", function () {
                            if (document.exitFullscreen) {
                                document.exitFullscreen();
                            } else if (document.msExitFullscreen) {
                                document.msExitFullscreen();
                            } else if (document.mozCancelFullScreen) {
                                document.mozCancelFullScreen();
                            } else if (document.webkitCancelFullScreen) {
                                document.webkitCancelFullScreen();
                            }
                        }, false);
                    }
                });
            });
        }
    }
});
