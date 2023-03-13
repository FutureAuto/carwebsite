!function() {
    "use strict";
    var G = 10
      , W = 16
      , q = 4.5
      , $ = 1.5
      , V = [0, 0, 0, .5]
      , a = !1
      , U = {};
    (window.captionator = U).CaptionatorCueStructure = function(e, t) {
        var s = this;
        this.isTimeDependent = !1,
        this.cueSource = e,
        this.options = t,
        this.processedCue = null,
        this.toString = function(a) {
            if (!1 === t.processCueHTML)
                return e;
            var o = function(e, t) {
                if (null !== s.processedCue)
                    return s.processedCue;
                var i, n, r = "";
                for (i in e)
                    i.match(/^\d+$/) && e.hasOwnProperty(i) && ((n = e[i])instanceof Object && n.children && n.children.length ? "v" === n.token ? r += '<q data-voice="' + n.voice.replace(/[\"]/g, "") + "\" class='voice speaker-" + n.voice.replace(/[^a-z0-9]+/gi, "-").toLowerCase() + " webvtt-span' title=\"" + n.voice.replace(/[\"]/g, "") + '">' + o(n.children, t + 1) + "</q>" : "c" === n.token ? r += "<span class='webvtt-span webvtt-class-span " + n.classes.join(" ") + "'>" + o(n.children, t + 1) + "</span>" : 0 < n.timeIn ? null == a || 0 < a && a >= n.timeIn ? r += "<span class='webvtt-span webvtt-timestamp-span' data-timestamp='" + n.token + "' data-timestamp-seconds='" + n.timeIn + "'>" + o(n.children, t + 1) + "</span>" : a < n.timeIn && (r += "<span class='webvtt-span webvtt-timestamp-span webvtt-cue-future' aria-hidden='true' style='opacity: 0;' data-timestamp='" + n.token + "' data-timestamp-seconds='" + n.timeIn + "'>" + o(n.children, t + 1) + "</span>") : r += n.rawToken + o(n.children, t + 1) + "</" + n.token + ">" : (n instanceof String || "string" == typeof n || "number" == typeof n) && (r += n));
                return s.isTimeDependent || 0 !== t || (s.processedCue = r),
                r
            };
            return o(this, 0)
        }
        ,
        this.getPlain = function(a) {
            if (!1 === t.processCueHTML)
                return e.replace(/<[^>]*>/gi, "");
            var o = function(e, t) {
                var i, n, r = "";
                for (i in e)
                    i.match(/^\d+$/) && e.hasOwnProperty(i) && ((n = e[i])instanceof Object && n.children && n.children.length ? 0 < n.timeIn ? (null == a || 0 < a && a >= n.timeIn) && (r += o(n.children, t + 1)) : r += o(n.children, t + 1) : (n instanceof String || "string" == typeof n || "number" == typeof n) && (r += n));
                return r
            };
            return o(this, 0)
        }
    }
    ,
    U.CaptionatorCueStructure.prototype = [],
    U.TextTrack = function(e, t, i, n, r, a) {
        this.onload = function() {}
        ,
        this.onerror = function() {}
        ,
        this.oncuechange = function() {}
        ,
        this.id = e || "",
        this.internalMode = U.TextTrack.OFF,
        this.cues = new U.TextTrackCueList(this),
        this.activeCues = new U.ActiveTextTrackCueList(this.cues,this),
        this.kind = t || "subtitles",
        this.label = i || "",
        this.language = n || "",
        this.src = r || "",
        this.readyState = U.TextTrack.NONE,
        this.internalDefault = a || !1,
        this.getMode = function() {
            return this.internalMode
        }
        ,
        this.setMode = function(e) {
            if (-1 === [U.TextTrack.OFF, U.TextTrack.HIDDEN, U.TextTrack.SHOWING].indexOf(e))
                throw new Error("Illegal mode value for track: " + e);
            e !== this.internalMode && (this.internalMode = e,
            this.readyState === U.TextTrack.NONE && 0 < this.src.length && e > U.TextTrack.OFF && this.loadTrack(this.src, null),
            this.videoNode._captionator_dirtyBit = !0,
            U.rebuildCaptions(this.videoNode),
            e === U.TextTrack.OFF && (this.cues.length = 0,
            this.readyState = U.TextTrack.NONE))
        }
        ,
        this.getDefault = function() {
            return this.internalDefault
        }
        ,
        Object.prototype.__defineGetter__ ? (this.__defineGetter__("mode", this.getMode),
        this.__defineSetter__("mode", this.setMode),
        this.__defineGetter__("default", this.getDefault)) : Object.defineProperty && (Object.defineProperty(this, "mode", {
            get: this.getMode,
            set: this.setMode
        }),
        Object.defineProperty(this, "default", {
            get: this.getDefault
        })),
        this.loadTrack = function(e, i) {
            var n, r = new XMLHttpRequest;
            if (this.readyState === U.TextTrack.LOADED)
                i instanceof Function && i(n);
            else {
                this.src = e,
                this.readyState = U.TextTrack.LOADING;
                var a = this;
                r.open("GET", e, !0),
                r.onreadystatechange = function(e) {
                    if (4 === r.readyState)
                        if (200 === r.status) {
                            var t = a.videoNode._captionatorOptions || {};
                            "metadata" === a.kind && (t.processCueHTML = !1,
                            t.sanitiseCueHTML = !1),
                            n = U.parseCaptions(r.responseText, t),
                            a.readyState = U.TextTrack.LOADED,
                            a.cues.loadCues(n),
                            a.activeCues.refreshCues.apply(a.activeCues),
                            a.videoNode._captionator_dirtyBit = !0,
                            U.rebuildCaptions(a.videoNode),
                            a.onload.call(this),
                            i instanceof Function && i.call(a, n)
                        } else
                            a.readyState = U.TextTrack.ERROR,
                            a.onerror()
                }
                ;
                try {
                    r.send(null)
                } catch (e) {
                    a.readyState = U.TextTrack.ERROR,
                    a.onerror(e)
                }
            }
        }
        ,
        this.addCue = function(e) {
            if (!(e && e instanceof U.TextTrackCue))
                throw new Error("The argument is null or not an instance of TextTrackCue.");
            this.cues.addCue(e)
        }
        ,
        this.removeCue = function() {}
    }
    ,
    U.TextTrack.NONE = 0,
    U.TextTrack.LOADING = 1,
    U.TextTrack.LOADED = 2,
    U.TextTrack.ERROR = 3,
    U.TextTrack.OFF = 0,
    U.TextTrack.HIDDEN = 1,
    U.TextTrack.SHOWING = 2,
    U.TextTrackCue = function(e, t, i, n, r, a, o) {
        if (this.id = e,
        this.track = o instanceof U.TextTrack ? o : null,
        this.startTime = parseFloat(t),
        this.endTime = parseFloat(i) >= this.startTime ? parseFloat(i) : this.startTime,
        this.text = "string" == typeof n || n instanceof U.CaptionatorCueStructure ? n : "",
        this.settings = "string" == typeof r ? r : "",
        this.intSettings = {},
        this.pauseOnExit = !!a,
        this.wasActive = !1,
        this.direction = "horizontal",
        this.snapToLines = !0,
        this.linePosition = "auto",
        this.textPosition = 50,
        this.size = 0,
        this.alignment = "middle",
        this.settings.length) {
            var s = this.intSettings
              , c = this;
            (r = r.split(/\s+/).filter(function(e) {
                return 0 < e.length
            }))instanceof Array && r.forEach(function(e) {
                var t = {
                    D: "direction",
                    L: "linePosition",
                    T: "textPosition",
                    A: "alignment",
                    S: "size"
                };
                t[(e = e.split(":"))[0]] && (s[t[e[0]]] = e[1]),
                t[e[0]]in c && (c[t[e[0]]] = e[1])
            })
        }
        this.linePosition.match(/\%/) && (this.snapToLines = !1),
        this.getCueAsSource = function() {
            return String(this.text)
        }
        ,
        this.getCueAsHTML = function() {
            var t = document.createDocumentFragment()
              , e = document.createElement("div");
            return e.innerHTML = String(this.text),
            Array.prototype.forEach.call(e.childNodes, function(e) {
                t.appendChild(e.cloneNode(!0))
            }),
            t
        }
        ,
        this.isActive = function() {
            var e = 0;
            if (this.track instanceof U.TextTrack && (this.track.mode === U.TextTrack.SHOWING || this.track.mode === U.TextTrack.HIDDEN) && this.track.readyState === U.TextTrack.LOADED)
                try {
                    if (e = this.track.videoNode.currentTime,
                    this.startTime <= e && this.endTime >= e)
                        return this.wasActive || (this.wasActive = !0,
                        this.onenter()),
                        !0
                } catch (e) {
                    return !1
                }
            return this.wasActive && (this.wasActive = !1,
            this.onexit()),
            !1
        }
        ,
        Object.prototype.__defineGetter__ ? this.__defineGetter__("active", this.isActive) : Object.defineProperty && Object.defineProperty(this, "active", {
            get: this.isActive
        }),
        this.toString = function() {
            return "TextTrackCue:" + this.id + "\n" + String(this.text)
        }
        ,
        this.onenter = function() {}
        ,
        this.onexit = function() {}
    }
    ,
    U.TextTrackCueList = function(e) {
        this.track = e instanceof U.TextTrack ? e : null,
        this.getCueById = function(t) {
            return this.filter(function(e) {
                return e.id === t
            })[0]
        }
        ,
        this.loadCues = function(e) {
            for (var t = 0; t < e.length; t++)
                e[t].track = this.track,
                Array.prototype.push.call(this, e[t])
        }
        ,
        this.addCue = function(e) {
            if (!(e && e instanceof U.TextTrackCue))
                throw new Error("The argument is null or not an instance of TextTrackCue.");
            if (e.track !== this.track && e.track)
                throw new Error("This cue is associated with a different track!");
            Array.prototype.push.call(this, e)
        }
        ,
        this.toString = function() {
            return "[TextTrackCueList]"
        }
    }
    ,
    U.TextTrackCueList.prototype = [],
    U.ActiveTextTrackCueList = function(e, r) {
        this.refreshCues = function() {
            if (e.length) {
                var t = this
                  , i = !1
                  , n = [].slice.call(this, 0);
                if (this.length = 0,
                e.forEach(function(e) {
                    e.active && (t.push(e),
                    t[t.length - 1] !== n[t.length - 1] && (i = !0))
                }),
                i)
                    try {
                        r.oncuechange()
                    } catch (e) {}
            }
        }
        ,
        this.toString = function() {
            return "[ActiveTextTrackCueList]"
        }
        ,
        this.refreshCues()
    }
    ,
    U.ActiveTextTrackCueList.prototype = new U.TextTrackCueList(null);
    U.rebuildCaptions = function(n) {
        var e, t = n.textTracks || [], r = (n._captionatorOptions instanceof Object && n._captionatorOptions,
        n.currentTime), i = [], a = [];
        t.forEach(function(e, t) {
            e.mode === U.TextTrack.SHOWING && e.readyState === U.TextTrack.LOADED && (a = (a = [].slice.call(e.activeCues, 0)).sort(function(e, t) {
                return e.startTime > t.startTime ? -1 : 1
            }),
            i = i.concat(a))
        }),
        e = i.map(function(e) {
            return e.track.id + "." + e.id + ":" + e.text.toString(r).length
        }),
        U.compareArray(e, n._captionator_previousActiveCues) && !n._captionator_dirtyBit || (n._captionator_dirtyBit = !1,
        n._captionator_availableCueArea = null,
        n._captionator_previousActiveCues = e,
        U.styleCueCanvas(n),
        [].slice.call(n._descriptionContainerObject.getElementsByTagName("div"), 0).concat([].slice.call(n._containerObject.getElementsByTagName("div"), 0)).forEach(function(e) {
            e.cueObject && !e.cueObject.active && (e.cueObject.rendered = !1,
            e.cueObject.domNode = null,
            e.parentElement.removeChild(e))
        }),
        i.forEach(function(e) {
            var t, i;
            "metadata" !== e.track.kind && e.mode !== U.TextTrack.HIDDEN && (e.rendered ? (i = (t = e.domNode).getElementsByClassName("captionator-cue-inner")[0],
            e.text.toString(r) !== t.currentText && (t.currentText = e.text.toString(r),
            i.innerHTML = t.currentText,
            i.spanified = !1)) : (t = document.createElement("div"),
            (i = document.createElement("span")).className = "captionator-cue-inner",
            t.id = String(e.id).length ? e.id : U.generateID(),
            t.className = "captionator-cue",
            t.appendChild(i),
            ((t.cueObject = e).domNode = t).setAttribute("lang", e.track.language),
            t.currentText = e.text.toString(r),
            i.innerHTML = t.currentText,
            e.rendered = !0,
            "descriptions" === e.track.kind ? n._descriptionContainerObject.appendChild(t) : n._containerObject.appendChild(t)),
            "descriptions" !== e.track.kind && U.styleCue(t, e, n))
        }))
    }
    ,
    U.captionify = function(e, t, i) {
        var n = []
          , r = 0;
        if ((i = i instanceof Object ? i : {}).minimumFontSize && "number" == typeof i.minimumFontSize && (G = i.minimumFontSize),
        i.minimumLineHeight && "number" == typeof i.minimumLineHeight && (W = i.minimumLineHeight),
        i.fontSizeVerticalPercentage && "number" == typeof i.fontSizeVerticalPercentage && (q = i.fontSizeVerticalPercentage),
        i.lineHeightRatio && "number" != typeof i.lineHeightRatio && ($ = i.lineHeightRatio),
        i.cueBackgroundColour && i.cueBackgroundColour instanceof Array && (V = i.cueBackgroundColour),
        !(HTMLVideoElement || e instanceof function(e) {
            this.targetObject = e,
            this.currentTime = 0;
            this.addEventListener = function(e, t, i) {
                "timeupdate" === e && t instanceof Function && (this.timeupdateEventHandler = t)
            }
            ,
            this.attachEvent = function(e, t) {
                "timeupdate" === e && t instanceof Function && (this.timeupdateEventHandler = t)
            }
            ,
            this.updateTime = function(e) {
                isNaN(e) || (this.currentTime = e)
            }
        }
        || i.forceCaptionify))
            return !1;
        if (("function" == typeof document.createElement("video").addTextTrack || "function" == typeof document.createElement("video").addTrack) && !i.forceCaptionify)
            return !1;
        if (!a && i.exportObjects && (window.TextTrack = U.TextTrack,
        window.TextTrackCueList = U.TextTrackCueList,
        window.ActiveTextTrackCueList = U.ActiveTextTrackCueList,
        window.TextTrackCue = U.TextTrackCue,
        a = !0),
        e && !1 !== e && null != e)
            if (e instanceof Array)
                for (r = 0; r < e.length; r++)
                    "string" == typeof e[r] ? n = n.concat([].slice.call(document.querySelectorAll(e[r]), 0)) : e[r].constructor === HTMLVideoElement && n.push(e[r]);
            else
                "string" == typeof e ? n = [].slice.call(document.querySelectorAll(e), 0) : e.constructor === HTMLVideoElement && n.push(e);
        else
            n = [].slice.call(document.getElementsByTagName("video"), 0);
        return !!n.length && (n.forEach(function(l) {
            l.addTextTrack = function(e, t, i, n, r, a, o) {
                var s, c = ["subtitles", "captions", "descriptions", "captions", "metadata", "chapters"];
                c.slice(0, 7);
                if (e = "string" == typeof e ? e : "",
                i = "string" == typeof i ? i : "",
                n = "string" == typeof n ? n : "",
                o = "boolean" == typeof o && o,
                c.filter(function(e) {
                    return t === e
                }).length)
                    return !!(s = new U.TextTrack(e,t,i,n,r,null)) && (l.textTracks instanceof Array || (l.textTracks = []),
                    l.textTracks.push(s),
                    s);
                throw U.createDOMException(12, "DOMException 12: SYNTAX_ERR: You must use a valid kind when creating a TimedTextTrack.", "SYNTAX_ERR")
            }
            ,
            U.processVideoElement(n[r], t, i)
        }),
        !0)
    }
    ,
    U.parseCaptions = function(e, m) {
        m = m instanceof Object ? m : {};
        var v = ""
          , r = []
          , T = ""
          , A = []
          , b = /^(\d{2})?:?(\d{2}):(\d{2})\.(\d+)\,(\d{2})?:?(\d{2}):(\d{2})\.(\d+)\s*(.*)/
          , C = /^(\d+)?:?(\d{2}):(\d{2})\.(\d+)\,(\d+)?:?(\d{2}):(\d{2})\.(\d+)\s*(.*)/
          , x = /^(\d{2})?:?(\d{2}):(\d{2})[\.\,](\d+)\s+\-\-\>\s+(\d{2})?:?(\d{2}):(\d{2})[\.\,](\d+)\s*(.*)/
          , f = /(\d{2})?:?(\d{2}):(\d{2})[\.\,](\d+)/
          , y = /^([\d\.]+)\s+\+([\d\.]+)\s*(.*)/
          , k = /^\[(\d{2})?:?(\d{2})\:(\d{2})\.(\d{2,3})\]\s*(.*?)$/
          , w = /^(DEFAULTS|DEFAULT)\s+\-\-\>\s+(.*)/g
          , _ = /^(STYLE|STYLES)\s+\-\-\>\s*\n([\s\S]*)/g
          , S = /^(COMMENT|COMMENTS)\s+\-\-\>\s+(.*)/g
          , n = /^(\d{2})?:?(\d{2}):(\d{2})\.(\d+)/;
        if (e) {
            var E = function(e) {
                function t(e) {
                    return !!e.replace(/[^a-z0-9]+/gi, "").length
                }
                var i, n, r, a, o, s = new U.CaptionatorCueStructure(e,m), c = [], l = [], u = 0;
                for (i in r = s,
                c = e.split(/(<\/?[^>]+>)/gi))
                    if (c.hasOwnProperty(i))
                        if ("<" === (n = c[i]).substr(0, 1)) {
                            if ("/" === n.substr(1, 1)) {
                                var d = n.substr(2).split(/[\s>]+/g)[0];
                                if (0 < l.length) {
                                    var p = 0;
                                    for (u = l.length - 1; 0 <= u; u--) {
                                        if (l[p = u][l[u].length - 1].token === d)
                                            break
                                    }
                                    r = l[p],
                                    l = l.slice(0, p)
                                }
                            } else if (n.substr(1).match(f) || n.match(/^<v\s+[^>]+>/i) || n.match(/^<c[a-z0-9\-\_\.]+>/) || n.match(/^<(b|i|u|ruby|rt)>/) || !1 !== m.sanitiseCueHTML) {
                                var h = {
                                    token: n.replace(/[<\/>]+/gi, "").split(/[\s\.]+/)[0],
                                    rawToken: n,
                                    children: []
                                };
                                "v" === h.token ? h.voice = n.match(/^<v\s*([^>]+)>/i)[1] : "c" === h.token ? h.classes = n.replace(/[<\/>\s]+/gi, "").split(/[\.]+/gi).slice(1).filter(t) : (a = h.rawToken.match(f)) && (s.isTimeDependent = !0,
                                o = a.slice(1),
                                h.timeIn = parseInt(60 * (o[0] || 0) * 60, 10) + parseInt(60 * (o[1] || 0), 10) + parseInt(o[2] || 0, 10) + parseFloat("0." + (o[3] || 0))),
                                r.push(h),
                                l.push(r),
                                r = h.children
                            }
                        } else
                            !1 !== m.sanitiseCueHTML && (n = n.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\&/g, "&amp;"),
                            m.ignoreWhitespace || (n = n.replace(/\n+/g, "<br />"))),
                            r.push(n);
                return s
            }
              , c = function(e) {
                var t, i = 0;
                return "string" != typeof e ? 0 : ((t = n.exec(e)) && (t = t.slice(1),
                i = parseInt(60 * (t[0] || 0) * 60, 10) + parseInt(60 * (t[1] || 0), 10) + parseInt(t[2] || 0, 10) + parseFloat("0." + (t[3] || 0))),
                i)
            };
            if (r = e.replace(/\r\n/g, "\n").replace(/\r/g, "\n"),
            /<tt\s+xml/gi.exec(e)) {
                var t = document.createElement("ttml");
                return t.innerHTML = e,
                [].slice.call(t.querySelectorAll("[begin],[end]"), 0).map(function(e, t) {
                    var i, n, r, a = String(e.getAttribute("begin")), o = String(e.getAttribute("end")), s = e.getAttribute("id") || t;
                    return n = c(a),
                    r = c(o),
                    i = !1 === m.processCueHTML ? e.innerHTML : E(e.innerHTML),
                    new U.TextTrackCue(s,n,r,i,{},!1,null)
                })
            }
            return e.split(/\n+/g).reduce(function(e, t, i, n) {
                return e || !!k.exec(t)
            }, !1) ? (r = r.split(/\n+/g),
            v = "LRC") : r = r.split(/\n\n+/g),
            r = r.filter(function(e) {
                return e.match(/^WEBVTT(\s*FILE)?/gi) ? !(v = "WebVTT") : !!e.replace(/\s*/gi, "").length
            }).map(function(e, t) {
                var i, n, r, a, o, s, c, l, u, d, p = "";
                if (l = w.exec(e))
                    return A = (A = l.slice(2).join("")).split(/\s+/g).filter(function(e) {
                        return e && !!e.length
                    }),
                    null;
                if (l = _.exec(e))
                    return T += l[l.length - 1],
                    null;
                if (l = S.exec(e))
                    return null;
                for (i = "LRC" === v ? [e.substr(0, e.indexOf("]") + 1), e.substr(e.indexOf("]") + 1)] : e.split(/\n/g); !i[0].replace(/\s+/gi, "").length && 0 < i.length; )
                    i.shift();
                for (c = i[0].match(/^\s*[a-z0-9\-]+\s*$/gi) ? String(i.shift().replace(/\s*/gi, "")) : t,
                s = 0; s < i.length; s++) {
                    var h = i[s];
                    (u = x.exec(h)) || (u = b.exec(h)) || (u = C.exec(h)) ? (o = u.slice(1),
                    n = parseInt(60 * (o[0] || 0) * 60, 10) + parseInt(60 * (o[1] || 0), 10) + parseInt(o[2] || 0, 10) + parseFloat("0." + (o[3] || 0)),
                    r = parseInt(60 * (o[4] || 0) * 60, 10) + parseInt(60 * (o[5] || 0), 10) + parseInt(o[6] || 0, 10) + parseFloat("0." + (o[7] || 0)),
                    o[8] && (p = o[8])) : (u = y.exec(h)) ? (o = u.slice(1),
                    r = (n = parseFloat(o[0])) + parseFloat(o[1]),
                    o[2] && (p = o[2])) : (u = k.exec(h)) && (o = u.slice(1, u.length - 1),
                    r = n = parseInt(60 * (o[0] || 0) * 60, 10) + parseInt(60 * (o[1] || 0), 10) + parseInt(o[2] || 0, 10) + parseFloat("0." + (o[3] || 0))),
                    i = i.slice(0, s).concat(i.slice(s + 1));
                    break
                }
                if (!n && !r)
                    return null;
                var f = A.reduce(function(e, t, i, n) {
                    return e[t.split(":")[0]] = t.split(":")[1],
                    e
                }, {});
                for (var g in f = p.split(/\s+/g).filter(function(e) {
                    return e && !!e.length
                }).reduce(function(e, t, i, n) {
                    return e[t.split(":")[0]] = t.split(":")[1],
                    e
                }, f),
                p = "",
                f)
                    f.hasOwnProperty(g) && (p += p.length ? " " : "",
                    p += g + ":" + f[g]);
                return a = !1 === m.processCueHTML ? i.join("\n") : E(i.join("\n")),
                (d = new U.TextTrackCue(c,n,r,a,p,!1,null)).styleData = T,
                d
            }).filter(function(e) {
                return null !== e
            }),
            "LRC" === v && (r.forEach(function(e, t) {
                var i, n = 0;
                0 < t && (n = e.startTime,
                (i = r[--t]).endTime < n && (i.endTime = n))
            }),
            r = r.filter(function(e) {
                return 0 < e.text.toString().replace(/\s*/, "").length
            })),
            r
        }
        throw new Error("Required parameter captionData not supplied.")
    }
    ,
    U.processVideoElement = function(r, a, o) {
        var s = []
          , e = navigator.language || navigator.userLanguage;
        a || e.split("-")[0];
        if (o = o instanceof Object ? o : {},
        !r.captioned) {
            r._captionatorOptions = o,
            r.className += (r.className.length ? " " : "") + "captioned",
            r.captioned = !0,
            0 === r.id.length && (r.id = U.generateID());
            [].slice.call(r.querySelectorAll("track"), 0).forEach(function(t) {
                var e = null;
                e = 0 < t.querySelectorAll("source").length ? t.querySelectorAll("source") : t.getAttribute("src");
                var i = r.addTextTrack(t.getAttribute("id") || U.generateID(), t.getAttribute("kind"), t.getAttribute("label"), t.getAttribute("srclang").split("-")[0], e, t.getAttribute("type"), t.hasAttribute("default"));
                (t.track = i).trackNode = t,
                i.videoNode = r,
                s.push(i);
                var n = !1;
                "subtitles" !== i.kind && "captions" !== i.kind || a !== i.language || !o.enableCaptionsByDefault || s.filter(function(e) {
                    return ("captions" === e.kind || "subtitles" === e.kind) && a === e.language && e.mode === U.TextTrack.SHOWING
                }).length || (n = !0),
                "chapters" === i.kind && a === i.language && (s.filter(function(e) {
                    return "chapters" === e.kind && e.mode === U.TextTrack.SHOWING
                }).length || (n = !0)),
                "descriptions" === i.kind && !0 === o.enableDescriptionsByDefault && a === i.language && (s.filter(function(e) {
                    return "descriptions" === e.kind && e.mode === U.TextTrack.SHOWING
                }).length || (n = !0)),
                !0 === n && s.forEach(function(e) {
                    e.trackNode.hasAttribute("default") && e.mode === U.TextTrack.SHOWING && (e.mode = U.TextTrack.HIDDEN)
                }),
                t.hasAttribute("default") && (s.filter(function(e) {
                    return !(!e.trackNode.hasAttribute("default") || e.trackNode === t)
                }).length || (n = !0,
                i.internalDefault = !0)),
                !0 === n && (i.mode = U.TextTrack.SHOWING)
            }),
            r.addEventListener("timeupdate", function(e) {
                var t = e.target;
                try {
                    t.textTracks.forEach(function(e) {
                        e.activeCues.refreshCues.apply(e.activeCues)
                    })
                } catch (e) {}
                o.renderer instanceof Function ? o.renderer.call(U, t) : U.rebuildCaptions(t)
            }, !1),
            window.addEventListener("resize", function(e) {
                r._captionator_dirtyBit = !0,
                U.rebuildCaptions(r)
            }, !1),
            !0 === o.enableHighResolution && window.setInterval(function() {
                try {
                    r.textTracks.forEach(function(e) {
                        e.activeCues.refreshCues.apply(e.activeCues)
                    })
                } catch (e) {}
                o.renderer instanceof Function ? o.renderer.call(U, r) : U.rebuildCaptions(r)
            }, 20)
        }
        return r
    }
    ,
    U.getNodeMetrics = function(e) {
        var t, i, n = window.getComputedStyle(e, null), r = e, a = e.offsetTop, o = e.offsetLeft, s = 0;
        for (t = parseInt(n.getPropertyValue("width"), 10),
        i = parseInt(n.getPropertyValue("height"), 10); r = r.offsetParent; )
            a += r.offsetTop,
            o += r.offsetLeft;
        if (e.hasAttribute("controls")) {
            var c = navigator.userAgent.toLowerCase();
            -1 !== c.indexOf("chrome") ? s = 32 : -1 !== c.indexOf("opera") ? s = 25 : -1 !== c.indexOf("firefox") ? s = 28 : -1 !== c.indexOf("ie 9") || -1 !== c.indexOf("ipad") ? s = 44 : -1 !== c.indexOf("safari") && (s = 25)
        } else if (e._captionatorOptions) {
            var l = e._captionatorOptions;
            l.controlHeight && (s = parseInt(l.controlHeight, 10))
        }
        return {
            left: o,
            top: a,
            width: t,
            height: i,
            controlHeight: s
        }
    }
    ,
    U.applyStyles = function(e, t) {
        for (var i in t)
            !{}.hasOwnProperty.call(t, i) || (e.style[i] = t[i])
    }
    ,
    U.checkDirection = function(e) {
        var t = "A-Za-zÀ-ÖØ-öø-ʸ̀-֐ࠀ-῿Ⰰ-﬜﷾-﹯﻽-￿"
          , i = "֑-߿יִ-﷽ﹰ-ﻼ"
          , n = new RegExp("^[^" + i + "]*[" + t + "]");
        return new RegExp("^[^" + t + "]*[" + i + "]").test(e) ? "rtl" : n.test(e) ? "ltr" : ""
    }
    ,
    U.styleCue = function(e, i, t) {
        var n, r, a, o, s, l, c, u, d, p, h, f, g, m, v, T, A = 0, b = 0, C = 0, x = 0, y = 0, k = 0, w = 0, _ = 0, S = 0, E = 0, O = 0, L = t._captionatorOptions || {}, M = 50, D = 0, H = 0, N = !0, I = "", P = (i.track.language,
        function(e) {
            if (e.spanified)
                return e.characterCount;
            function t(e) {
                return !!e.length
            }
            function i(e) {
                c++,
                U.applyStyles(e, {
                    display: "block",
                    lineHeight: "auto",
                    height: l + "px",
                    width: f + "px",
                    textAlign: "center"
                })
            }
            var n, r, a, o, s = "<span class='captionator-cue-character'>", c = 0;
            for (n in e.childNodes)
                e.childNodes.hasOwnProperty(n) && !e.childNodes[n].nospan && (3 === (r = e.childNodes[n]).nodeType ? (o = document.createDocumentFragment(),
                a = r.nodeValue,
                o.appendChild(document.createElement("span")),
                o.childNodes[0].innerHTML = s + a.split(/(.)/).filter(t).join("</span>" + s) + "</span>",
                [].slice.call(o.querySelectorAll("span.captionator-cue-character"), 0).forEach(i),
                r.parentNode.replaceChild(o, r)) : 1 === e.childNodes[n].nodeType && (c += P(e.childNodes[n])));
            return e.characterCount = c,
            e.spanified = !0,
            c
        }
        );
        if (v = U.getNodeMetrics(t),
        t._captionator_availableCueArea || (t._captionator_availableCueArea = {
            bottom: v.height - v.controlHeight,
            right: v.width,
            top: 0,
            left: 0,
            height: v.height - v.controlHeight,
            width: v.width
        }),
        "horizontal" === i.direction && (U.applyStyles(e, {
            width: "auto",
            position: "static",
            display: "inline-block",
            padding: "1em"
        }),
        D = parseInt(e.offsetWidth, 10),
        H = (H = Math.floor(D / t._captionator_availableCueArea.width * 100)) <= 100 ? H : 100),
        s = v.height * (q / 100) / 96 * 72,
        s = G <= s ? s : G,
        l = Math.floor(s / 72 * 96),
        c = Math.floor(s * $),
        c = W < c ? c : W,
        h = Math.ceil(c / 72 * 96),
        (f = h) * Math.floor(v.height / h) < v.height && (h = Math.floor(v.height / Math.floor(v.height / h)),
        c = Math.ceil(h / 96 * 72)),
        h * Math.floor(v.width / h) < v.width && (f = Math.ceil(v.width / Math.floor(v.width / h))),
        d = Math.floor(t._captionator_availableCueArea.height / h),
        p = Math.floor(t._captionator_availableCueArea.width / f),
        0 === parseFloat(String(i.size).replace(/[^\d\.]/gi, "")) ? !0 === L.sizeCuesByTextBoundingBox ? n = H : N = !(n = 100) : (N = !1,
        n = (n = parseFloat(String(i.size).replace(/[^\d\.]/gi, ""))) <= 100 ? n : 100),
        a = "horizontal" === i.direction ? Math.floor(.01 * v.width) : 0,
        o = "horizontal" === i.direction ? 0 : Math.floor(.01 * v.height),
        "auto" === i.linePosition ? i.linePosition = "horizontal" === i.direction ? d : p : String(i.linePosition).match(/\%/) && (i.snapToLines = !1,
        i.linePosition = parseFloat(String(i.linePosition).replace(/\%/gi, ""))),
        "horizontal" === i.direction)
            x = h,
            "auto" !== i.textPosition && N && (H < n - (M = parseFloat(String(i.textPosition).replace(/[^\d\.]/gi, ""))) ? n -= M : n = H),
            C = !0 === i.snapToLines ? t._captionator_availableCueArea.width * (n / 100) : v.width * (n / 100),
            A = "auto" === i.textPosition ? (t._captionator_availableCueArea.right - C) / 2 + t._captionator_availableCueArea.left : (M = parseFloat(String(i.textPosition).replace(/[^\d\.]/gi, "")),
            (t._captionator_availableCueArea.right - C) * (M / 100) + t._captionator_availableCueArea.left),
            b = !0 === i.snapToLines ? (d - 1) * h + t._captionator_availableCueArea.top : (u = v.controlHeight + h + 2 * o,
            (v.height - u) * (i.linePosition / 100));
        else {
            if (b = t._captionator_availableCueArea.top,
            A = t._captionator_availableCueArea.right - f,
            C = f,
            x = t._captionator_availableCueArea.height * (n / 100),
            k = P(e),
            w = [].slice.call(e.querySelectorAll("span.captionator-cue-character"), 0),
            y = Math.floor((x - 2 * o) / l),
            C = Math.ceil(k / y) * f,
            _ = Math.ceil(k / y),
            S = (k - y * (_ - 1)) * l,
            !0 === i.snapToLines)
                A = "vertical-lr" === i.direction ? t._captionator_availableCueArea.left : t._captionator_availableCueArea.right - C;
            else {
                var z = C + 2 * a;
                A = "vertical-lr" === i.direction ? (v.width - z) * (i.linePosition / 100) : v.width - z - (v.width - z) * (i.linePosition / 100)
            }
            b = "auto" === i.textPosition ? (t._captionator_availableCueArea.bottom - x) / 2 + t._captionator_availableCueArea.top : (i.textPosition = parseFloat(String(i.textPosition).replace(/[^\d\.]/gi, "")),
            (t._captionator_availableCueArea.bottom - x) * (i.textPosition / 100) + t._captionator_availableCueArea.top),
            m = g = O = E = 0,
            w.forEach(function(e, t) {
                g = "vertical-lr" === i.direction ? f * E : C - f * (E + 1),
                "start" === i.alignment || "start" !== i.alignment && E < _ - 1 ? m = O * l + o : "end" === i.alignment ? m = O * l - l + (x + 2 * o - S) : "middle" === i.alignment && (m = (x - 2 * o - S) / 2 + O * l),
                e.setAttribute("aria-hidden", "true"),
                U.applyStyles(e, {
                    position: "absolute",
                    top: m + "px",
                    left: g + "px"
                }),
                y - 1 <= O ? (O = 0,
                E++) : O++
            }),
            e.accessified || (I = i.text.getPlain(t.currentTime),
            (T = document.createElement("div")).innerHTML = I,
            T.nospan = !0,
            e.appendChild(T),
            e.accessified = !0,
            U.applyStyles(T, {
                position: "absolute",
                overflow: "hidden",
                width: "1px",
                height: "1px",
                opacity: "0",
                textIndent: "-999em"
            }))
        }
        if ("horizontal" === i.direction && (r = "rtl" === U.checkDirection(String(i.text)) ? {
            start: "right",
            middle: "center",
            end: "left"
        }[i.alignment] : {
            start: "left",
            middle: "center",
            end: "right"
        }[i.alignment]),
        U.applyStyles(e, {
            position: "absolute",
            overflow: "hidden",
            width: C + "px",
            height: x + "px",
            top: b + "px",
            left: A + "px",
            padding: o + "px " + a + "px",
            textAlign: r,
            backgroundColor: "rgba(" + V.join(",") + ")",
            direction: U.checkDirection(String(i.text)),
            lineHeight: c + "pt",
            boxSizing: "border-box"
        }),
        "vertical" === i.direction || "vertical-lr" === i.direction)
            A - t._captionator_availableCueArea.left - t._captionator_availableCueArea.left >= t._captionator_availableCueArea.right - (A + C) ? t._captionator_availableCueArea.right = A : t._captionator_availableCueArea.left = A + C,
            t._captionator_availableCueArea.width = t._captionator_availableCueArea.right - t._captionator_availableCueArea.left;
        else {
            if (e.scrollHeight > 1.2 * e.offsetHeight)
                if (i.snapToLines) {
                    for (var R = 0; e.scrollHeight > 1.2 * e.offsetHeight; )
                        x += h,
                        e.style.height = x + "px",
                        R++;
                    b -= R * h,
                    e.style.top = b + "px"
                } else {
                    e.scrollHeight;
                    x = e.scrollHeight + o,
                    u = v.controlHeight + x + 2 * o,
                    b = (v.height - u) * (i.linePosition / 100),
                    e.style.height = x + "px",
                    e.style.top = b + "px"
                }
            b - t._captionator_availableCueArea.top - t._captionator_availableCueArea.top >= t._captionator_availableCueArea.bottom - (b + x) && t._captionator_availableCueArea.bottom > b ? t._captionator_availableCueArea.bottom = b : t._captionator_availableCueArea.top < b + x && (t._captionator_availableCueArea.top = b + x),
            t._captionator_availableCueArea.height = t._captionator_availableCueArea.bottom - t._captionator_availableCueArea.top
        }
        if (L.debugMode) {
            var F, j, B = function() {
                F || (t._captionatorDebugCanvas ? (F = t._captionatorDebugCanvas,
                j = t._captionatorDebugContext) : ((F = document.createElement("canvas")).setAttribute("width", v.width),
                F.setAttribute("height", v.height - v.controlHeight),
                document.body.appendChild(F),
                U.applyStyles(F, {
                    position: "absolute",
                    top: v.top + "px",
                    left: v.left + "px",
                    width: v.width + "px",
                    height: v.height - v.controlHeight + "px",
                    zIndex: 3e3
                }),
                j = F.getContext("2d"),
                t._captionatorDebugCanvas = F,
                t._captionatorDebugContext = j))
            };
            B(),
            F.setAttribute("width", v.width),
            B(),
            j.fillStyle = "rgba(100,100,255,0.5)",
            j.fillRect(t._captionator_availableCueArea.left, t._captionator_availableCueArea.top, t._captionator_availableCueArea.right, t._captionator_availableCueArea.bottom),
            j.stroke(),
            function() {
                var e;
                for (B(),
                j.strokeStyle = "rgba(255,0,0,0.5)",
                j.lineWidth = 1,
                j.beginPath(),
                e = 0; e < d; e++)
                    j.moveTo(.5, e * h + .5),
                    j.lineTo(v.width, e * h + .5);
                for (j.closePath(),
                j.stroke(),
                j.beginPath(),
                j.strokeStyle = "rgba(0,255,0,0.5)",
                e = p; 0 <= e; e--)
                    j.moveTo(v.width - e * f - .5, -.5),
                    j.lineTo(v.width - e * f - .5, v.height);
                for (j.closePath(),
                j.stroke(),
                j.beginPath(),
                j.strokeStyle = "rgba(255,255,0,0.5)",
                e = 0; e <= p; e++)
                    j.moveTo(e * f + .5, -.5),
                    j.lineTo(e * f + .5, v.height);
                j.stroke(),
                t.linesDrawn = !0
            }()
        }
    }
    ,
    U.styleCueCanvas = function(e) {
        var t, i, n, r, a, o, s = e._captionatorOptions instanceof Object ? e._captionatorOptions : {};
        if (!(e instanceof HTMLVideoElement))
            throw new Error("Cannot style a cue canvas for a non-video node!");
        if (e._containerObject && (a = (n = e._containerObject).id),
        e._descriptionContainerObject && (o = (r = e._descriptionContainerObject).id),
        r ? r.parentNode || document.body.appendChild(r) : ((r = document.createElement("div")).className = "captionator-cue-descriptive-container",
        o = U.generateID(),
        r.id = o,
        (e._descriptionContainerObject = r).setAttribute("aria-live", "polite"),
        r.setAttribute("aria-atomic", "true"),
        r.setAttribute("role", "region"),
        document.body.appendChild(r),
        U.applyStyles(r, {
            position: "absolute",
            overflow: "hidden",
            width: "1px",
            height: "1px",
            opacity: "0",
            textIndent: "-999em"
        })),
        n)
            n.parentNode || document.body.appendChild(n);
        else {
            if ((n = document.createElement("div")).className = "captionator-cue-canvas",
            a = U.generateID(),
            n.id = a,
            s.appendCueCanvasTo) {
                var c = null;
                if (s.appendCueCanvasTo instanceof HTMLElement)
                    c = s.appendCueCanvasTo;
                else if ("string" == typeof s.appendCueCanvasTo)
                    try {
                        var l = document.querySelectorAll(s.appendCueCanvasTo);
                        if (!(0 < l.length))
                            throw null;
                        c = l[0]
                    } catch (e) {
                        c = document.body,
                        s.appendCueCanvasTo = !1
                    }
                else
                    c = document.body,
                    s.appendCueCanvasTo = !1;
                c.appendChild(n)
            } else
                document.body.appendChild(n);
            e._containerObject = n
        }
        var u = U.getNodeMetrics(e);
        t = u.height * (q / 100) / 96 * 72,
        t = G <= t ? t : G,
        i = Math.floor(t * $),
        i = W < i ? i : W,
        U.applyStyles(n, {
            position: "absolute",
            overflow: "hidden",
            zIndex: 100,
            height: u.height - u.controlHeight + "px",
            width: u.width + "px",
            top: (s.appendCueCanvasTo ? 0 : u.top) + "px",
            left: (s.appendCueCanvasTo ? 0 : u.left) + "px",
            color: "white",
            fontFamily: "Verdana, Helvetica, Arial, sans-serif",
            fontSize: t + "pt",
            lineHeight: i + "pt",
            boxSizing: "border-box"
        })
    }
    ,
    U.createDOMException = function(t, i, n) {
        try {
            document.querySelectorAll("div/[]")
        } catch (e) {
            var r = function(e, t, i) {
                this.code = e,
                this.message = t,
                this.name = i
            };
            return r.prototype = e,
            new r(t,i,n)
        }
    }
    ,
    U.compareArray = function(e, t) {
        if (!(e instanceof Array && t instanceof Array))
            return !1;
        if (e.length !== t.length)
            return !1;
        for (var i in e)
            if (e.hasOwnProperty(i) && e[i] !== t[i])
                return !1;
        return !0
    }
    ,
    U.generateID = function(e) {
        var t = "";
        for (e = e || 10; t.length < e; )
            t += String.fromCharCode(65 + Math.floor(26 * Math.random()));
        return "captionator" + t
    }
}(),
function(e) {
    var t, r, i, n = navigator.userAgent;
    function a(e) {
        var t, i, n = e.parentNode;
        "PICTURE" === n.nodeName.toUpperCase() ? (t = r.cloneNode(),
        n.insertBefore(t, n.firstElementChild),
        setTimeout(function() {
            n.removeChild(t)
        })) : (!e._pfLastSize || e.offsetWidth > e._pfLastSize) && (e._pfLastSize = e.offsetWidth,
        i = e.sizes,
        e.sizes += ",100vw",
        setTimeout(function() {
            e.sizes = i
        }))
    }
    function o() {
        var e, t = document.querySelectorAll("picture > img, img[srcset][sizes]");
        for (e = 0; e < t.length; e++)
            a(t[e])
    }
    function s() {
        clearTimeout(t),
        t = setTimeout(o, 99)
    }
    function c() {
        s(),
        i && i.addListener && i.addListener(s)
    }
    e.HTMLPictureElement && /ecko/.test(n) && n.match(/rv\:(\d+)/) && RegExp.$1 < 45 && addEventListener("resize", (r = document.createElement("source"),
    i = e.matchMedia && matchMedia("(orientation: landscape)"),
    r.srcset = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
    /^[c|i]|d$/.test(document.readyState || "") ? c() : document.addEventListener("DOMContentLoaded", c),
    s))
}(window),
function(e, a, l) {
    "use strict";
    var r, u, o;
    a.createElement("picture");
    function t() {}
    function i(e, t, i, n) {
        e.addEventListener ? e.addEventListener(t, i, n || !1) : e.attachEvent && e.attachEvent("on" + t, i)
    }
    function n(t) {
        var i = {};
        return function(e) {
            return e in i || (i[e] = t(e)),
            i[e]
        }
    }
    var A = {}
      , s = !1
      , c = a.createElement("img")
      , d = c.getAttribute
      , p = c.setAttribute
      , h = c.removeAttribute
      , f = a.documentElement
      , g = {}
      , b = {
        algorithm: ""
    }
      , m = "data-pfsrc"
      , v = m + "set"
      , T = navigator.userAgent
      , C = /rident/.test(T) || /ecko/.test(T) && T.match(/rv\:(\d+)/) && 35 < RegExp.$1
      , x = "currentSrc"
      , y = /\s+\+?\d+(e\d+)?w/
      , k = /(\([^)]+\))?\s*(.+)/
      , w = e.picturefillCFG
      , _ = "font-size:100%!important;"
      , S = !0
      , E = {}
      , O = {}
      , L = e.devicePixelRatio
      , M = {
        px: 1,
        in: 96
    }
      , D = a.createElement("a")
      , H = !1
      , N = /^[ \t\n\r\u000c]+/
      , I = /^[, \t\n\r\u000c]+/
      , P = /^[^ \t\n\r\u000c]+/
      , z = /[,]+$/
      , R = /^\d+$/
      , F = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/;
    function j(e) {
        return " " === e || "\t" === e || "\n" === e || "\f" === e || "\r" === e
    }
    function B(e, t) {
        return e.w ? (e.cWidth = A.calcListLength(t || "100vw"),
        e.res = e.w / e.cWidth) : e.res = e.d,
        e
    }
    var G, W, q, $, V, U, Q, Y, X, K, J, Z, ee, te, ie, ne, re, ae, oe = (G = /^([\d\.]+)(em|vw|px)$/,
    W = n(function(e) {
        return "return " + function() {
            for (var e = arguments, t = 0, i = e[0]; ++t in e; )
                i = i.replace(e[t], e[++t]);
            return i
        }((e || "").toLowerCase(), /\band\b/g, "&&", /,/g, "||", /min-([a-z-\s]+):/g, "e.$1>=", /max-([a-z-\s]+):/g, "e.$1<=", /calc([^)]+)/g, "($1)", /(\d+[\.]*[\d]*)([a-z]+)/g, "($1 * e.$2)", /^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/gi, "") + ";"
    }),
    function(e, t) {
        var i;
        if (!(e in E))
            if (E[e] = !1,
            t && (i = e.match(G)))
                E[e] = i[1] * M[i[2]];
            else
                try {
                    E[e] = new Function("e",W(e))(M)
                } catch (e) {}
        return E[e]
    }
    ), se = function(e) {
        if (s) {
            var t, i, n, r = e || {};
            if (r.elements && 1 === r.elements.nodeType && ("IMG" === r.elements.nodeName.toUpperCase() ? r.elements = [r.elements] : (r.context = r.elements,
            r.elements = null)),
            n = (t = r.elements || A.qsa(r.context || a, r.reevaluate || r.reselect ? A.sel : A.selShort)).length) {
                for (A.setupRun(r),
                H = !0,
                i = 0; i < n; i++)
                    A.fillImg(t[i], r);
                A.teardownRun(r)
            }
        }
    };
    function ce(e, t) {
        return e.res - t.res
    }
    function le(e, t) {
        var i, n, r;
        if (e && t)
            for (r = A.parseSet(t),
            e = A.makeUrl(e),
            i = 0; i < r.length; i++)
                if (e === A.makeUrl(r[i].url)) {
                    n = r[i];
                    break
                }
        return n
    }
    function ue() {
        2 === V.width && (A.supSizes = !0),
        u = A.supSrcset && !A.supSizes,
        s = !0,
        setTimeout(se)
    }
    e.console && console.warn,
    x in c || (x = "src"),
    g["image/jpeg"] = !0,
    g["image/gif"] = !0,
    g["image/png"] = !0,
    g["image/svg+xml"] = a.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1"),
    A.ns = ("pf" + (new Date).getTime()).substr(0, 9),
    A.supSrcset = "srcset"in c,
    A.supSizes = "sizes"in c,
    A.supPicture = !!e.HTMLPictureElement,
    A.supSrcset && A.supPicture && !A.supSizes && (q = a.createElement("img"),
    c.srcset = "data:,a",
    q.src = "data:,a",
    A.supSrcset = c.complete === q.complete,
    A.supPicture = A.supSrcset && A.supPicture),
    A.supSrcset && !A.supSizes ? ($ = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
    (V = a.createElement("img")).onload = ue,
    V.onerror = ue,
    V.setAttribute("sizes", "9px"),
    V.srcset = $ + " 1w,data:image/gif;base64,R0lGODlhAgABAPAAAP///wAAACH5BAAAAAAALAAAAAACAAEAAAICBAoAOw== 9w",
    V.src = $) : s = !0,
    A.selShort = "picture>img,img[srcset]",
    A.sel = A.selShort,
    A.cfg = b,
    A.DPR = L || 1,
    A.u = M,
    A.types = g,
    A.setSize = t,
    A.makeUrl = n(function(e) {
        return D.href = e,
        D.href
    }),
    A.qsa = function(e, t) {
        return "querySelector"in e ? e.querySelectorAll(t) : []
    }
    ,
    A.matchesMedia = function() {
        return e.matchMedia && (matchMedia("(min-width: 0.1em)") || {}).matches ? A.matchesMedia = function(e) {
            return !e || matchMedia(e).matches
        }
        : A.matchesMedia = A.mMQ,
        A.matchesMedia.apply(this, arguments)
    }
    ,
    A.mMQ = function(e) {
        return !e || oe(e)
    }
    ,
    A.calcLength = function(e) {
        var t = oe(e, !0) || !1;
        return t < 0 && (t = !1),
        t
    }
    ,
    A.supportsType = function(e) {
        return !e || g[e]
    }
    ,
    A.parseSize = n(function(e) {
        var t = (e || "").match(k);
        return {
            media: t && t[1],
            length: t && t[2]
        }
    }),
    A.parseSet = function(e) {
        return e.cands || (e.cands = function(n, d) {
            function e(e) {
                var t, i = e.exec(n.substring(o));
                if (i)
                    return t = i[0],
                    o += t.length,
                    t
            }
            var p, h, t, i, r, a = n.length, o = 0, f = [];
            function s() {
                var e, t, i, n, r, a, o, s, c, l = !1, u = {};
                for (n = 0; n < h.length; n++)
                    a = (r = h[n])[r.length - 1],
                    o = r.substring(0, r.length - 1),
                    s = parseInt(o, 10),
                    c = parseFloat(o),
                    R.test(o) && "w" === a ? ((e || t) && (l = !0),
                    0 === s ? l = !0 : e = s) : F.test(o) && "x" === a ? ((e || t || i) && (l = !0),
                    c < 0 ? l = !0 : t = c) : R.test(o) && "h" === a ? ((i || t) && (l = !0),
                    0 === s ? l = !0 : i = s) : l = !0;
                l || (u.url = p,
                e && (u.w = e),
                t && (u.d = t),
                i && (u.h = i),
                i || t || e || (u.d = 1),
                1 === u.d && (d.has1x = !0),
                u.set = d,
                f.push(u))
            }
            function c() {
                for (e(N),
                t = "",
                i = "in descriptor"; ; ) {
                    if (r = n.charAt(o),
                    "in descriptor" === i)
                        if (j(r))
                            t && (h.push(t),
                            t = "",
                            i = "after descriptor");
                        else {
                            if ("," === r)
                                return o += 1,
                                t && h.push(t),
                                void s();
                            if ("(" === r)
                                t += r,
                                i = "in parens";
                            else {
                                if ("" === r)
                                    return t && h.push(t),
                                    void s();
                                t += r
                            }
                        }
                    else if ("in parens" === i)
                        if (")" === r)
                            t += r,
                            i = "in descriptor";
                        else {
                            if ("" === r)
                                return h.push(t),
                                void s();
                            t += r
                        }
                    else if ("after descriptor" === i)
                        if (j(r))
                            ;
                        else {
                            if ("" === r)
                                return void s();
                            i = "in descriptor",
                            o -= 1
                        }
                    o += 1
                }
            }
            for (; ; ) {
                if (e(I),
                a <= o)
                    return f;
                p = e(P),
                h = [],
                "," === p.slice(-1) ? (p = p.replace(z, ""),
                s()) : c()
            }
        }(e.srcset, e)),
        e.cands
    }
    ,
    A.getEmValue = function() {
        var e;
        if (!r && (e = a.body)) {
            var t = a.createElement("div")
              , i = f.style.cssText
              , n = e.style.cssText;
            t.style.cssText = "position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)",
            f.style.cssText = _,
            e.style.cssText = _,
            e.appendChild(t),
            r = t.offsetWidth,
            e.removeChild(t),
            r = parseFloat(r, 10),
            f.style.cssText = i,
            e.style.cssText = n
        }
        return r || 16
    }
    ,
    A.calcListLength = function(e) {
        if (!(e in O) || b.uT) {
            var t = A.calcLength(function(e) {
                var t, i, n, r, a, o, s, c = /^(?:[+-]?[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?(?:ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmin|vmax|vw)$/i, l = /^calc\((?:[0-9a-z \.\+\-\*\/\(\)]+)\)$/i;
                for (n = (i = function(e) {
                    var t, i = "", n = [], r = [], a = 0, o = 0, s = !1;
                    function c() {
                        i && (n.push(i),
                        i = "")
                    }
                    function l() {
                        n[0] && (r.push(n),
                        n = [])
                    }
                    for (; ; ) {
                        if ("" === (t = e.charAt(o)))
                            return c(),
                            l(),
                            r;
                        if (s) {
                            if ("*" === t && "/" === e[o + 1]) {
                                s = !1,
                                o += 2,
                                c();
                                continue
                            }
                            o += 1
                        } else {
                            if (j(t)) {
                                if (e.charAt(o - 1) && j(e.charAt(o - 1)) || !i) {
                                    o += 1;
                                    continue
                                }
                                if (0 === a) {
                                    c(),
                                    o += 1;
                                    continue
                                }
                                t = " "
                            } else if ("(" === t)
                                a += 1;
                            else if (")" === t)
                                a -= 1;
                            else {
                                if ("," === t) {
                                    c(),
                                    l(),
                                    o += 1;
                                    continue
                                }
                                if ("/" === t && "*" === e.charAt(o + 1)) {
                                    s = !0,
                                    o += 2;
                                    continue
                                }
                            }
                            i += t,
                            o += 1
                        }
                    }
                }(e)).length,
                t = 0; t < n; t++)
                    if (a = (r = i[t])[r.length - 1],
                    s = a,
                    c.test(s) && 0 <= parseFloat(s) || l.test(s) || "0" === s || "-0" === s || "+0" === s) {
                        if (o = a,
                        r.pop(),
                        0 === r.length)
                            return o;
                        if (r = r.join(" "),
                        A.matchesMedia(r))
                            return o
                    }
                return "100vw"
            }(e));
            O[e] = t || M.width
        }
        return O[e]
    }
    ,
    A.setRes = function(e) {
        var t;
        if (e)
            for (var i = 0, n = (t = A.parseSet(e)).length; i < n; i++)
                B(t[i], e.sizes);
        return t
    }
    ,
    A.setRes.res = B,
    A.applySetCandidate = function(e, t) {
        if (e.length) {
            var i, n, r, a, o, s, c, l, u, d, p, h, f, g, m, v = t[A.ns], T = A.DPR;
            if (s = v.curSrc || t[x],
            (c = v.curCan || function(e, t, i) {
                var n;
                return !i && t && (i = (i = e[A.ns].sets) && i[i.length - 1]),
                (n = le(t, i)) && (t = A.makeUrl(t),
                e[A.ns].curSrc = t,
                (e[A.ns].curCan = n).res || B(n, n.set.sizes)),
                n
            }(t, s, e[0].set)) && c.set === e[0].set && ((u = C && !t.complete && c.res - .1 > T) || (c.cached = !0,
            c.res >= T && (o = c))),
            !o)
                for (e.sort(ce),
                o = e[(a = e.length) - 1],
                n = 0; n < a; n++)
                    if ((i = e[n]).res >= T) {
                        o = e[r = n - 1] && (u || s !== A.makeUrl(i.url)) && (d = e[r].res,
                        p = i.res,
                        h = T,
                        f = e[r].cached,
                        m = g = void 0,
                        h < ("saveData" === b.algorithm ? 2.7 < d ? h + 1 : (m = (p - h) * (g = Math.pow(d - .6, 1.5)),
                        f && (m += .1 * g),
                        d + m) : 1 < h ? Math.sqrt(d * p) : d)) ? e[r] : i;
                        break
                    }
            o && (l = A.makeUrl(o.url),
            v.curSrc = l,
            v.curCan = o,
            l !== s && A.setSrc(t, o),
            A.setSize(t))
        }
    }
    ,
    A.setSrc = function(e, t) {
        var i;
        e.src = t.url,
        "image/svg+xml" === t.set.type && (i = e.style.width,
        e.style.width = e.offsetWidth + 1 + "px",
        e.offsetWidth + 1 && (e.style.width = i))
    }
    ,
    A.getSet = function(e) {
        var t, i, n, r = !1, a = e[A.ns].sets;
        for (t = 0; t < a.length && !r; t++)
            if ((i = a[t]).srcset && A.matchesMedia(i.media) && (n = A.supportsType(i.type))) {
                "pending" === n && (i = n),
                r = i;
                break
            }
        return r
    }
    ,
    A.parseSets = function(e, t, i) {
        var n, r, a, o, s = t && "PICTURE" === t.nodeName.toUpperCase(), c = e[A.ns];
        c.src !== l && !i.src || (c.src = d.call(e, "src"),
        c.src ? p.call(e, m, c.src) : h.call(e, m)),
        c.srcset !== l && !i.srcset && A.supSrcset && !e.srcset || (n = d.call(e, "srcset"),
        c.srcset = n,
        o = !0),
        c.sets = [],
        s && (c.pic = !0,
        function(e, t) {
            var i, n, r, a, o = e.getElementsByTagName("source");
            for (i = 0,
            n = o.length; i < n; i++)
                (r = o[i])[A.ns] = !0,
                (a = r.getAttribute("srcset")) && t.push({
                    srcset: a,
                    media: r.getAttribute("media"),
                    type: r.getAttribute("type"),
                    sizes: r.getAttribute("sizes")
                })
        }(t, c.sets)),
        c.srcset ? (r = {
            srcset: c.srcset,
            sizes: d.call(e, "sizes")
        },
        c.sets.push(r),
        (a = (u || c.src) && y.test(c.srcset || "")) || !c.src || le(c.src, r) || r.has1x || (r.srcset += ", " + c.src,
        r.cands.push({
            url: c.src,
            d: 1,
            set: r
        }))) : c.src && c.sets.push({
            srcset: c.src,
            sizes: null
        }),
        c.curCan = null,
        c.curSrc = l,
        c.supported = !(s || r && !A.supSrcset || a && !A.supSizes),
        o && A.supSrcset && !c.supported && (n ? (p.call(e, v, n),
        e.srcset = "") : h.call(e, v)),
        c.supported && !c.srcset && (!c.src && e.src || e.src !== A.makeUrl(c.src)) && (null === c.src ? e.removeAttribute("src") : e.src = c.src),
        c.parsed = !0
    }
    ,
    A.fillImg = function(e, t) {
        var i, n = t.reselect || t.reevaluate;
        e[A.ns] || (e[A.ns] = {}),
        i = e[A.ns],
        !n && i.evaled === o || (i.parsed && !t.reevaluate || A.parseSets(e, e.parentNode, t),
        i.supported ? i.evaled = o : function(e) {
            var t, i = A.getSet(e), n = !1;
            "pending" !== i && (n = o,
            i && (t = A.setRes(i),
            A.applySetCandidate(t, e))),
            e[A.ns].evaled = n
        }(e))
    }
    ,
    A.setupRun = function() {
        H && !S && L === e.devicePixelRatio || (S = !1,
        L = e.devicePixelRatio,
        E = {},
        O = {},
        A.DPR = L || 1,
        M.width = Math.max(e.innerWidth || 0, f.clientWidth),
        M.height = Math.max(e.innerHeight || 0, f.clientHeight),
        M.vw = M.width / 100,
        M.vh = M.height / 100,
        o = [M.height, M.width, L].join("-"),
        M.em = A.getEmValue(),
        M.rem = M.em)
    }
    ,
    A.supPicture ? (se = t,
    A.fillImg = t) : (Z = e.attachEvent ? /d$|^c/ : /d$|^c|^i/,
    ee = function() {
        var e = a.readyState || "";
        te = setTimeout(ee, "loading" === e ? 200 : 999),
        a.body && (A.fillImgs(),
        (U = U || Z.test(e)) && clearTimeout(te))
    }
    ,
    te = setTimeout(ee, a.body ? 9 : 99),
    ie = f.clientHeight,
    i(e, "resize", (Q = function() {
        S = Math.max(e.innerWidth || 0, f.clientWidth) !== M.width || f.clientHeight !== ie,
        ie = f.clientHeight,
        S && A.fillImgs()
    }
    ,
    Y = 99,
    J = function() {
        var e = new Date - K;
        e < Y ? X = setTimeout(J, Y - e) : (X = null,
        Q())
    }
    ,
    function() {
        K = new Date,
        X = X || setTimeout(J, Y)
    }
    )),
    i(a, "readystatechange", ee)),
    A.picturefill = se,
    A.fillImgs = se,
    A.teardownRun = t,
    se._ = A,
    e.picturefillCFG = {
        pf: A,
        push: function(e) {
            var t = e.shift();
            "function" == typeof A[t] ? A[t].apply(A, e) : (b[t] = e[0],
            H && A.fillImgs({
                reselect: !0
            }))
        }
    };
    for (; w && w.length; )
        e.picturefillCFG.push(w.shift());
    e.picturefill = se,
    "object" == typeof module && "object" == typeof module.exports ? module.exports = se : "function" == typeof define && define.amd && define("picturefill", function() {
        return se
    }),
    A.supPicture || (g["image/webp"] = (ne = "image/webp",
    re = "data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==",
    (ae = new e.Image).onerror = function() {
        g[ne] = !1,
        se()
    }
    ,
    ae.onload = function() {
        g[ne] = 1 === ae.width,
        se()
    }
    ,
    ae.src = re,
    "pending"))
}(window, document);
