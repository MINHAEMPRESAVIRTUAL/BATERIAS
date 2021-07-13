(function(){
    var script = {
 "start": "this.init()",
 "class": "Player",
 "scrollBarWidth": 10,
 "id": "rootPlayer",
 "mobileMipmappingEnabled": false,
 "propagateClick": false,
 "scrollBarColor": "#000000",
 "desktopMipmappingEnabled": false,
 "vrPolyfillScale": 0.5,
 "mouseWheelEnabled": true,
 "scrollBarOpacity": 0.5,
 "children": [
  "this.MainViewer",
  "this.IconButton_95550FCB_8CEE_FC69_41D0_8D677C4437ED",
  "this.Container_9FCE5336_8D57_19CA_41C4_62A2857AE04F",
  "this.Container_9FC8C333_8D57_19CA_41DB_491C9DF20604",
  "this.Container_80D7D5AB_8D76_EDC1_41D4_A762D2B0D8E7",
  "this.veilPopupPanorama",
  "this.zoomImagePopupPanorama",
  "this.closeButtonPopupPanorama"
 ],
 "borderSize": 0,
 "paddingRight": 0,
 "backgroundPreloadEnabled": true,
 "paddingLeft": 0,
 "layout": "absolute",
 "minHeight": 20,
 "scrollBarVisible": "rollOver",
 "defaultVRPointer": "laser",
 "scripts": {
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "registerKey": function(key, value){  window[key] = value; },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "existsKey": function(key){  return key in window; },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "unregisterKey": function(key){  delete window[key]; },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "getKey": function(key){  return window[key]; }
 },
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "minWidth": 20,
 "verticalAlign": "top",
 "horizontalAlign": "left",
 "height": "100%",
 "gap": 10,
 "paddingTop": 0,
 "downloadEnabled": false,
 "paddingBottom": 0,
 "borderRadius": 0,
 "shadow": false,
 "data": {
  "name": "Player461"
 },
 "overflow": "visible",
 "definitions": [{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86F878D5_8C95_0479_41CD_5CDFE5265804"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41"
  }
 ],
 "class": "Panorama",
 "hfov": 360,
 "partial": false,
 "id": "panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5",
 "thumbnailUrl": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_t.jpg",
 "label": "SAM_101_2966",
 "pitch": 0,
 "hfovMax": 130,
 "hfovMin": "150%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_990D2AAD_8CB5_0429_41CB_F42AFA56DC08",
  "this.overlay_99EA0F9D_8CB5_1CE9_41E0_65046562AE94",
  "this.panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 129,
  "yaw": 79.9,
  "class": "PanoramaCameraPosition",
  "pitch": -1.84
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_8257741C_B2B1_6871_41D0_6E6862B8BCDA"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 129,
  "yaw": 41.79,
  "class": "PanoramaCameraPosition",
  "pitch": 5.3
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_861034B5_8C95_0C39_41CE_711600E16501_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 34.9,
  "class": "PanoramaCameraPosition",
  "pitch": 1.84
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_821E13CE_B2B1_6FD1_41C4_30055838D96B"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 20.22,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_824133FD_B2B1_6FB3_41DD_D74A8DE9169F"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -144.45,
  "class": "PanoramaCameraPosition",
  "pitch": -2.76
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_camera"
},
{
 "items": [
  {
   "media": "this.panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_camera"
  },
  {
   "media": "this.panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_camera"
  },
  {
   "media": "this.panorama_86154962_8C95_045B_41A2_0938ED55B232",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_86154962_8C95_045B_41A2_0938ED55B232_camera"
  },
  {
   "media": "this.panorama_8614519F_8C95_04E9_41E0_BD41479F0428",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8614519F_8C95_04E9_41E0_BD41479F0428_camera"
  },
  {
   "media": "this.panorama_8614AA68_8C95_0457_41C4_75E622B27531",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8614AA68_8C95_0457_41C4_75E622B27531_camera"
  },
  {
   "media": "this.panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_camera"
  },
  {
   "media": "this.panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_camera"
  },
  {
   "media": "this.panorama_861034B5_8C95_0C39_41CE_711600E16501",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_861034B5_8C95_0C39_41CE_711600E16501_camera"
  },
  {
   "media": "this.panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_camera"
  },
  {
   "media": "this.panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_camera"
  },
  {
   "media": "this.panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_camera"
  },
  {
   "media": "this.panorama_86F878D5_8C95_0479_41CD_5CDFE5265804",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_camera"
  },
  {
   "media": "this.panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 13)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_camera"
  },
  {
   "media": "this.panorama_86F99BB0_8C95_0437_41D3_944ADD73F375",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 13, 14)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_camera"
  },
  {
   "media": "this.panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 14, 15)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_camera"
  },
  {
   "media": "this.panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 15, 16)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_camera"
  },
  {
   "media": "this.panorama_86E7127F_8C93_0429_41D7_F100BCD60333",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 16, 17)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_86E7127F_8C93_0429_41D7_F100BCD60333_camera"
  },
  {
   "media": "this.video_83F9A4B1_8D51_18C9_41CA_C596246C7689",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.mainPlayList, 17, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.mainPlayList, 17)",
   "class": "VideoPlayListItem",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer); this.setEndToItemIndex(this.mainPlayList, 17, 0)",
   "player": "this.MainViewerVideoPlayer",
   "end": "this.trigger('tourEnded')"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_861034B5_8C95_0C39_41CE_711600E16501"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8614AA68_8C95_0457_41C4_75E622B27531"
  }
 ],
 "class": "Panorama",
 "hfov": 360,
 "partial": false,
 "id": "panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4",
 "thumbnailUrl": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_t.jpg",
 "label": "SAM_101_2961",
 "pitch": 0,
 "hfovMax": 130,
 "hfovMin": "150%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_9E02C583_8CB3_0CD9_41DE_EB74E1F83FB9",
  "this.overlay_98B70611_8CB3_0FF9_41D2_258D4A23A9B9",
  "this.panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_tcap0",
  "this.overlay_88D16009_9ED2_FBC5_41BB_54640CDF2382"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -122.05,
  "class": "PanoramaCameraPosition",
  "pitch": -10.24
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_8287744B_B2B1_68D7_41D7_1093EC663157"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -154.5,
  "class": "PanoramaCameraPosition",
  "pitch": -8.54
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_81E0A38F_B2B1_686E_41CD_3798841E987E"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 145,
  "yaw": 58.28,
  "class": "PanoramaCameraPosition",
  "pitch": -5.53
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_828AF43B_B2B1_68B7_41D1_7425603622F1"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B"
  }
 ],
 "class": "Panorama",
 "hfov": 360,
 "label": "SAM_101_2963",
 "id": "panorama_861034B5_8C95_0C39_41CE_711600E16501",
 "thumbnailUrl": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 138,
 "hfovMin": "187%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_98B2D936_8CBF_043B_41B3_0214C7717C0B",
  "this.overlay_9F6894AC_8CBD_0C2F_41DC_DAB9A4844586",
  "this.panorama_861034B5_8C95_0C39_41CE_711600E16501_tcap0"
 ]
},
{
 "closeButtonPressedBackgroundColorDirection": "vertical",
 "closeButtonPressedIconColor": "#888888",
 "closeButtonRollOverBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "data": {
  "name": "Window41144"
 },
 "bodyPaddingRight": 0,
 "id": "window_B7E5B820_9EF7_2BC4_41DC_5E90BA481160",
 "class": "Window",
 "scrollBarColor": "#000000",
 "bodyPaddingTop": 0,
 "backgroundColorRatios": [],
 "scrollBarOpacity": 0.5,
 "headerVerticalAlign": "middle",
 "closeButtonPaddingTop": 5,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "scrollBarVisible": "rollOver",
 "bodyBackgroundOpacity": 0,
 "bodyBackgroundColorDirection": "vertical",
 "footerHeight": 5,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "shadowVerticalLength": 0,
 "minHeight": 20,
 "titlePaddingLeft": 5,
 "closeButtonRollOverBackgroundColorDirection": "vertical",
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "verticalAlign": "middle",
 "veilColorRatios": [
  0,
  1
 ],
 "minWidth": 20,
 "titleFontSize": "1.29vmin",
 "modal": true,
 "backgroundColor": [],
 "bodyPaddingBottom": 0,
 "headerBackgroundColorDirection": "vertical",
 "hideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "shadowSpread": 1,
 "closeButtonBorderColor": "#000000",
 "closeButtonBackgroundColorDirection": "vertical",
 "closeButtonBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "closeButtonRollOverIconColor": "#666666",
 "backgroundOpacity": 1,
 "closeButtonPressedIconLineWidth": 5,
 "footerBackgroundOpacity": 0,
 "titlePaddingTop": 5,
 "closeButtonPressedBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "closeButtonRollOverBorderColor": "#000000",
 "closeButtonPressedBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "closeButtonRollOverIconLineWidth": 5,
 "overflow": "scroll",
 "veilOpacity": 0.4,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "propagateClick": false,
 "shadow": true,
 "closeButtonRollOverBorderSize": 0,
 "headerPaddingRight": 0,
 "footerBackgroundColorDirection": "vertical",
 "children": [
  "this.viewer_uid81C98351_B2B1_68F3_41BB_2BA21B69775D"
 ],
 "veilShowEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "titlePaddingRight": 5,
 "closeButtonIconHeight": 20,
 "shadowHorizontalLength": 3,
 "shadowColor": "#000000",
 "layout": "vertical",
 "borderSize": 0,
 "paddingRight": 0,
 "titleFontFamily": "Arial",
 "backgroundColorDirection": "vertical",
 "headerPaddingBottom": 5,
 "closeButtonIconColor": "#000000",
 "closeButtonBackgroundOpacity": 0.3,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "closeButtonPressedBackgroundOpacity": 0.3,
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "closeButtonPaddingRight": 5,
 "headerPaddingTop": 10,
 "closeButtonPaddingLeft": 5,
 "closeButtonPaddingBottom": 5,
 "headerPaddingLeft": 10,
 "veilHideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "closeButtonBorderSize": 0,
 "closeButtonBorderRadius": 0,
 "shadowBlurRadius": 6,
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "gap": 10,
 "closeButtonPressedBorderColor": "#000000",
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "closeButtonRollOverBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "headerBackgroundOpacity": 0,
 "closeButtonBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "shadowOpacity": 0.5,
 "bodyPaddingLeft": 0,
 "closeButtonIconLineWidth": 5,
 "paddingBottom": 0,
 "borderRadius": 5,
 "titlePaddingBottom": 5,
 "showEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "paddingTop": 0,
 "closeButtonRollOverBackgroundOpacity": 0.3,
 "scrollBarWidth": 10,
 "closeButtonIconWidth": 20,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "closeButtonPressedBorderSize": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 137,
  "yaw": -114.19,
  "class": "PanoramaCameraPosition",
  "pitch": 5.51
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_81EAB380_B2B1_6851_41C2_7BC599C54A24"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -132,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_832874E7_B2B1_69DF_41E3_9196655D4EAA"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 129,
  "yaw": 41.79,
  "class": "PanoramaCameraPosition",
  "pitch": 5.3
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_820493BE_B2B1_6FB1_41DA_58982EA9CEFC"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -129.38,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_8346D554_B2B1_68F2_41BA_64CC547D61E5"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -154.5,
  "class": "PanoramaCameraPosition",
  "pitch": -8.54
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_827EE42C_B2B1_6851_41DF_F0AF2C3BA681"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -147.86,
  "class": "PanoramaCameraPosition",
  "pitch": -4.59
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_8222F3DD_B2B1_6FF2_41CB_3D2DC30E3B14"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -98.73,
  "class": "PanoramaCameraPosition",
  "pitch": -7.79
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_82FCB499_B2B1_6873_41B6_EEBE5FE8AA92"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -138.67,
  "class": "PanoramaCameraPosition",
  "pitch": -10.1
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_82EE3489_B2B1_6853_41C9_231956DB5F0D"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -105.79,
  "class": "PanoramaCameraPosition",
  "pitch": -4.41
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_82A4F45A_B2B1_68F6_41E2_719DAACF7F60"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_82B2746A_B2B1_68D1_41D0_CD225201D372"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -144.23,
  "class": "PanoramaCameraPosition",
  "pitch": 3.71
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_831A34A9_B2B1_6853_41D4_F84CD9670FAC"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_86E7127F_8C93_0429_41D7_F100BCD60333_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -138.67,
  "class": "PanoramaCameraPosition",
  "pitch": -10.1
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_82DFC47A_B2B1_68B1_41D7_4A9C72994F27"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -105.79,
  "class": "PanoramaCameraPosition",
  "pitch": -4.41
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_81DE2370_B2B1_68B1_419D_3AF0457CE4DD"
},
{
 "class": "Video",
 "label": "LOJA 01",
 "scaleMode": "fit_inside",
 "thumbnailUrl": "media/video_83F9A4B1_8D51_18C9_41CA_C596246C7689_t.jpg",
 "width": 1280,
 "loop": false,
 "id": "video_83F9A4B1_8D51_18C9_41CA_C596246C7689",
 "height": 720,
 "video": {
  "width": 1280,
  "height": 720,
  "class": "VideoResource",
  "mp4Url": "media/video_83F9A4B1_8D51_18C9_41CA_C596246C7689.mp4"
 }
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -122.05,
  "class": "PanoramaCameraPosition",
  "pitch": -10.24
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_86154962_8C95_045B_41A2_0938ED55B232_camera"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86154962_8C95_045B_41A2_0938ED55B232"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4"
  }
 ],
 "class": "Panorama",
 "hfov": 360,
 "partial": false,
 "id": "panorama_8614519F_8C95_04E9_41E0_BD41479F0428",
 "thumbnailUrl": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_t.jpg",
 "label": "SAM_101_2959",
 "pitch": 0,
 "hfovMax": 130,
 "hfovMin": "150%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_9CF37AE0_8CAF_0457_41BF_1B91186C72F8",
  "this.overlay_9EC7AFF2_8CB3_3C3B_41CB_E9AC969236FC",
  "this.panorama_8614519F_8C95_04E9_41E0_BD41479F0428_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 56.65,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_8338C4F7_B2B1_69BF_41E3_89DDFC7A7B2D"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5"
  }
 ],
 "class": "Panorama",
 "hfov": 360,
 "partial": false,
 "id": "panorama_86F99BB0_8C95_0437_41D3_944ADD73F375",
 "thumbnailUrl": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_t.jpg",
 "label": "SAM_101_2969",
 "pitch": 0,
 "hfovMax": 130,
 "hfovMin": "141%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_9B6E6788_8C95_0CD7_41D5_67C94075418C",
  "this.overlay_943241C0_8C95_0457_41DA_DDDC68BD7739",
  "this.panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -107.04,
  "class": "PanoramaCameraPosition",
  "pitch": -7.74
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_8614AA68_8C95_0457_41C4_75E622B27531_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -122.05,
  "class": "PanoramaCameraPosition",
  "pitch": -10.24
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_81D4F370_B2B1_68B1_41E2_D6915BFB3669"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 84.54,
   "backwardYaw": -123.35,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4"
  }
 ],
 "class": "Panorama",
 "hfov": 360,
 "partial": false,
 "id": "panorama_86E7127F_8C93_0429_41D7_F100BCD60333",
 "thumbnailUrl": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_t.jpg",
 "label": "SAM_101_2984",
 "pitch": 0,
 "hfovMax": 130,
 "hfovMin": "150%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.panorama_86E7127F_8C93_0429_41D7_F100BCD60333_tcap0",
  "this.overlay_91D570A9_8CED_04D6_41C5_A31A16AEE232",
  "this.overlay_93E6BB68_8CEF_0457_41DB_0B79BE6CC335",
  "this.overlay_88F0D308_9EF7_1DC3_41C0_6538BC6CB9A0",
  "this.popup_B778D61D_9EF7_27FD_4163_BCF3D3447174",
  "this.overlay_B73FAB3D_9ED1_EC3D_41CD_36650EAC00AE"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_82C1447A_B2B1_68B1_41DC_4F784757F17A"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_camera"
},
{
 "closeButtonPressedBackgroundColorDirection": "vertical",
 "closeButtonPressedIconColor": "#888888",
 "closeButtonRollOverBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "data": {
  "name": "Window39286"
 },
 "bodyPaddingRight": 0,
 "id": "window_B7147323_9EF1_3DC5_41C0_001A3DCF327E",
 "class": "Window",
 "scrollBarColor": "#000000",
 "bodyPaddingTop": 0,
 "backgroundColorRatios": [],
 "scrollBarOpacity": 0.5,
 "headerVerticalAlign": "middle",
 "closeButtonPaddingTop": 5,
 "headerBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "scrollBarVisible": "rollOver",
 "bodyBackgroundOpacity": 0,
 "bodyBackgroundColorDirection": "vertical",
 "footerHeight": 5,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "shadowVerticalLength": 0,
 "minHeight": 20,
 "titlePaddingLeft": 5,
 "closeButtonRollOverBackgroundColorDirection": "vertical",
 "veilColor": [
  "#000000",
  "#000000"
 ],
 "verticalAlign": "middle",
 "veilColorRatios": [
  0,
  1
 ],
 "minWidth": 20,
 "titleFontSize": "1.29vmin",
 "modal": true,
 "backgroundColor": [],
 "bodyPaddingBottom": 0,
 "headerBackgroundColorDirection": "vertical",
 "hideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "shadowSpread": 1,
 "closeButtonBorderColor": "#000000",
 "closeButtonBackgroundColorDirection": "vertical",
 "closeButtonBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "closeButtonRollOverIconColor": "#666666",
 "backgroundOpacity": 1,
 "closeButtonPressedIconLineWidth": 5,
 "footerBackgroundOpacity": 0,
 "titlePaddingTop": 5,
 "closeButtonPressedBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "closeButtonRollOverBorderColor": "#000000",
 "closeButtonPressedBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "closeButtonRollOverIconLineWidth": 5,
 "overflow": "scroll",
 "veilOpacity": 0.4,
 "footerBackgroundColor": [
  "#FFFFFF",
  "#EEEEEE",
  "#DDDDDD"
 ],
 "propagateClick": false,
 "shadow": true,
 "closeButtonRollOverBorderSize": 0,
 "headerPaddingRight": 0,
 "footerBackgroundColorDirection": "vertical",
 "children": [
  "this.viewer_uid81B37341_B2B1_68D3_41E3_027541A971BA"
 ],
 "veilShowEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "titlePaddingRight": 5,
 "closeButtonIconHeight": 20,
 "shadowHorizontalLength": 3,
 "shadowColor": "#000000",
 "layout": "vertical",
 "borderSize": 0,
 "paddingRight": 0,
 "titleFontFamily": "Arial",
 "backgroundColorDirection": "vertical",
 "headerPaddingBottom": 5,
 "closeButtonIconColor": "#000000",
 "closeButtonBackgroundOpacity": 0.3,
 "footerBackgroundColorRatios": [
  0,
  0.9,
  1
 ],
 "closeButtonPressedBackgroundOpacity": 0.3,
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "closeButtonPaddingRight": 5,
 "headerPaddingTop": 10,
 "closeButtonPaddingLeft": 5,
 "closeButtonPaddingBottom": 5,
 "headerPaddingLeft": 10,
 "veilHideEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeOutEffect"
 },
 "closeButtonBorderSize": 0,
 "closeButtonBorderRadius": 0,
 "shadowBlurRadius": 6,
 "bodyBackgroundColor": [
  "#FFFFFF",
  "#DDDDDD",
  "#FFFFFF"
 ],
 "gap": 10,
 "closeButtonPressedBorderColor": "#000000",
 "headerBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "closeButtonRollOverBackgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "headerBackgroundOpacity": 0,
 "closeButtonBackgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "shadowOpacity": 0.5,
 "bodyPaddingLeft": 0,
 "closeButtonIconLineWidth": 5,
 "paddingBottom": 0,
 "borderRadius": 5,
 "titlePaddingBottom": 5,
 "showEffect": {
  "duration": 500,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "paddingTop": 0,
 "closeButtonRollOverBackgroundOpacity": 0.3,
 "scrollBarWidth": 10,
 "closeButtonIconWidth": 20,
 "bodyBackgroundColorRatios": [
  0,
  0.5,
  1
 ],
 "closeButtonPressedBorderSize": 0
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -144.45,
  "class": "PanoramaCameraPosition",
  "pitch": -2.76
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_830BB499_B2B1_6873_41D7_A67CADDD8A7A"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -146.79,
  "class": "PanoramaCameraPosition",
  "pitch": -3.19
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_8296644B_B2B1_68D7_41E3_468B7E60E349"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5"
  }
 ],
 "class": "Panorama",
 "hfov": 360,
 "partial": false,
 "id": "panorama_86F878D5_8C95_0479_41CD_5CDFE5265804",
 "thumbnailUrl": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_t.jpg",
 "label": "SAM_101_2967",
 "pitch": 0,
 "hfovMax": 130,
 "hfovMin": "150%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_995AE96B_8CB3_0429_41C7_ACA0244109FB",
  "this.overlay_9A777E9E_8CB3_3CEB_41D3_B04C146C244D",
  "this.panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -147.86,
  "class": "PanoramaCameraPosition",
  "pitch": -4.59
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_823D83ED_B2B1_6FD3_41E1_E10207FC816E"
},
{
 "items": [
  {
   "media": "this.video_8B62C7ED_93D1_1859_41BC_8A8721CAB784",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_81C95351_B2B1_68F3_41D6_31AB6D2D987A, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_81C95351_B2B1_68F3_41D6_31AB6D2D987A, 0)",
   "class": "VideoPlayListItem",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer)",
   "player": "this.MainViewerVideoPlayer"
  }
 ],
 "id": "playList_81C95351_B2B1_68F3_41D6_31AB6D2D987A",
 "class": "PlayList"
},
{
 "viewerArea": "this.MainViewer",
 "buttonCardboardView": "this.IconButton_80D7C5AB_8D76_EDC1_41C9_879925DF7049",
 "displayPlaybackBar": true,
 "class": "PanoramaPlayer",
 "touchControlMode": "drag_rotation",
 "id": "MainViewerPanoramaPlayer",
 "gyroscopeVerticalDraggingEnabled": true,
 "mouseControlMode": "drag_rotation"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_861034B5_8C95_0C39_41CE_711600E16501"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5"
  }
 ],
 "class": "Panorama",
 "hfov": 360,
 "label": "SAM_101_2964",
 "id": "panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41",
 "thumbnailUrl": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 148,
 "hfovMin": "150%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_988BE1F9_8CB3_0429_41C6_E5C5E2E5B204",
  "this.overlay_98FF835A_8CB3_046B_41D9_15CF9E0DBCB2",
  "this.overlay_98BC321C_8CB7_07EF_41C7_21A21E1ADF44",
  "this.panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_tcap0"
 ]
},
{
 "displayOriginPosition": {
  "hfov": 165,
  "yaw": -114.19,
  "stereographicFactor": 0.3,
  "class": "RotationalCameraDisplayPosition",
  "pitch": -90
 },
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 137,
  "yaw": -114.19,
  "class": "PanoramaCameraPosition",
  "pitch": 5.51
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_camera",
 "displayMovements": [
  {
   "duration": 1000,
   "easing": "linear",
   "class": "TargetRotationalCameraDisplayMovement"
  },
  {
   "targetPitch": 5.51,
   "duration": 3000,
   "targetHfov": 137,
   "targetStereographicFactor": 0,
   "class": "TargetRotationalCameraDisplayMovement",
   "easing": "cubic_in_out"
  }
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 129,
  "yaw": 79.9,
  "class": "PanoramaCameraPosition",
  "pitch": -1.84
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_825B140C_B2B1_6852_41DF_39C89341220E"
},
{
 "class": "Video",
 "label": "VIDEO 02",
 "scaleMode": "fit_inside",
 "thumbnailUrl": "media/video_8B62C7ED_93D1_1859_41BC_8A8721CAB784_t.jpg",
 "width": 1280,
 "loop": false,
 "id": "video_8B62C7ED_93D1_1859_41BC_8A8721CAB784",
 "height": 720,
 "video": {
  "width": 1280,
  "height": 720,
  "class": "VideoResource",
  "mp4Url": "media/video_8B62C7ED_93D1_1859_41BC_8A8721CAB784.mp4"
 }
},
{
 "items": [
  {
   "media": "this.video_8B62C7ED_93D1_1859_41BC_8A8721CAB784",
   "start": "this.viewer_uid81C98351_B2B1_68F3_41BB_2BA21B69775DVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.PlayList_B73A6D90_9EDF_64C4_41E0_7A938A001F63, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.PlayList_B73A6D90_9EDF_64C4_41E0_7A938A001F63, 0)",
   "class": "VideoPlayListItem",
   "begin": "this.fixTogglePlayPauseButton(this.viewer_uid81C98351_B2B1_68F3_41BB_2BA21B69775DVideoPlayer)",
   "player": "this.viewer_uid81C98351_B2B1_68F3_41BB_2BA21B69775DVideoPlayer"
  }
 ],
 "id": "PlayList_B73A6D90_9EDF_64C4_41E0_7A938A001F63",
 "class": "PlayList"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 50.62,
   "backwardYaw": -159.78,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4"
  }
 ],
 "class": "Panorama",
 "hfov": 360,
 "partial": false,
 "id": "panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6",
 "thumbnailUrl": "media/panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_t.jpg",
 "label": "SAM_101_2981",
 "pitch": 0,
 "hfovMax": 130,
 "hfovMin": "150%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_tcap0",
  "this.overlay_90378848_8CED_0457_41D6_05E54761A745",
  "this.overlay_8B4913E8_93D3_1847_41B5_6D4EBAF09FAA"
 ]
},
{
 "items": [
  {
   "media": "this.video_8C811B07_93F1_29C9_41D9_B94085F2D89C",
   "start": "this.MainViewerVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.playList_81C96351_B2B1_68F3_41A2_2D82997D5C3E, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.playList_81C96351_B2B1_68F3_41A2_2D82997D5C3E, 0)",
   "class": "VideoPlayListItem",
   "begin": "this.fixTogglePlayPauseButton(this.MainViewerVideoPlayer)",
   "player": "this.MainViewerVideoPlayer"
  }
 ],
 "id": "playList_81C96351_B2B1_68F3_41A2_2D82997D5C3E",
 "class": "PlayList"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 145,
  "yaw": 58.28,
  "class": "PanoramaCameraPosition",
  "pitch": -5.53
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_camera"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8614519F_8C95_04E9_41E0_BD41479F0428"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B"
  }
 ],
 "class": "Panorama",
 "hfov": 360,
 "partial": false,
 "id": "panorama_8614AA68_8C95_0457_41C4_75E622B27531",
 "thumbnailUrl": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_t.jpg",
 "label": "SAM_101_2960",
 "pitch": 0,
 "hfovMax": 130,
 "hfovMin": "150%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_9E2ED4CF_8CB5_0C69_41DE_AAE51F8E6353",
  "this.overlay_9EC16294_8CB7_04FF_41D3_6B1C1FED06C0",
  "this.panorama_8614AA68_8C95_0457_41C4_75E622B27531_tcap0",
  "this.overlay_B7232AD5_9ED1_6C4D_41D3_0A3EBFC5FB6C"
 ]
},
{
 "autoplay": true,
 "audio": {
  "class": "AudioResource",
  "oggUrl": "media/audio_BEF969BA_8D53_E5C3_41D3_C82C4CE7DE08.ogg",
  "mp3Url": "media/audio_BEF969BA_8D53_E5C3_41D3_C82C4CE7DE08.mp3"
 },
 "class": "PanoramaAudio",
 "id": "audio_BEF969BA_8D53_E5C3_41D3_C82C4CE7DE08",
 "data": {
  "label": "BATERIAS OK"
 }
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -95.46,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_8336E526_B2B1_6851_41C4_CF99918AD89C"
},
{
 "rotationY": 0,
 "yaw": -36.41,
 "showDuration": 500,
 "class": "PopupPanoramaOverlay",
 "hfov": 14.84,
 "autoplay": true,
 "id": "popup_B778D61D_9EF7_27FD_4163_BCF3D3447174",
 "rotationX": 0,
 "rotationZ": 0,
 "showEasing": "cubic_in",
 "hideEasing": "cubic_out",
 "loop": false,
 "popupMaxHeight": "95%",
 "popupDistance": 100,
 "popupMaxWidth": "95%",
 "hideDuration": 500,
 "pitch": 3.43,
 "video": {
  "width": 1280,
  "height": 720,
  "class": "VideoResource",
  "mp4Url": "media/video_8B62C7ED_93D1_1859_41BC_8A8721CAB784.mp4"
 }
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -107.04,
  "class": "PanoramaCameraPosition",
  "pitch": -7.74
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_81DA5361_B2B1_68D3_41E3_7E8594DBA919"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -144.23,
  "class": "PanoramaCameraPosition",
  "pitch": 3.71
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_8614519F_8C95_04E9_41E0_BD41479F0428_camera"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4"
  }
 ],
 "class": "Panorama",
 "hfov": 360,
 "label": "Fachada",
 "audios": [
  "this.audio_BEF969BA_8D53_E5C3_41D3_C82C4CE7DE08"
 ],
 "id": "panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF",
 "thumbnailUrl": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_t.jpg",
 "pitch": 0,
 "partial": false,
 "hfovMax": 137,
 "hfovMin": "150%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_82B0A39F_8C95_04E9_41DB_D90F801CDA75",
  "this.panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_tcap0",
  "this.overlay_839C054B_8D53_3859_41BA_9DEEB4A922DA",
  "this.overlay_8289837D_8D51_183E_41A2_04F9911F61B2",
  "this.overlay_889DB0E2_9EF3_3C47_41DF_0DBA0685232F",
  "this.popup_88F25FC8_9EF1_2443_41CE_E64CF76003F2",
  "this.overlay_B76C2874_9ED1_6C43_41B8_9E521CDEEE56"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -105.79,
  "class": "PanoramaCameraPosition",
  "pitch": -4.41
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -123.35,
   "backwardYaw": 84.54,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86E7127F_8C93_0429_41D7_F100BCD60333"
  },
  {
   "yaw": -159.78,
   "backwardYaw": 50.62,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF"
  }
 ],
 "class": "Panorama",
 "hfov": 360,
 "partial": false,
 "id": "panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4",
 "thumbnailUrl": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_t.jpg",
 "label": "SAM_101_2971",
 "pitch": 0,
 "hfovMax": 130,
 "hfovMin": "150%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_tcap0",
  "this.overlay_9029B7D5_8CF5_0C79_418C_5663B67351D6",
  "this.overlay_922EE268_8CF3_0457_41CF_287C08445C09",
  "this.overlay_82AD6AAA_8D5F_28DB_41CB_B9EF6ECE9BFF",
  "this.overlay_9FEE3096_8D5F_78CB_41D3_FE0BD10C15A5"
 ]
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_861034B5_8C95_0C39_41CE_711600E16501"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_861034B5_8C95_0C39_41CE_711600E16501"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4"
  }
 ],
 "class": "Panorama",
 "hfov": 360,
 "partial": false,
 "id": "panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B",
 "thumbnailUrl": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_t.jpg",
 "label": "SAM_101_2962",
 "pitch": 0,
 "hfovMax": 130,
 "hfovMin": "150%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_9FB39CB1_8CBD_7C39_41E0_60E6E425DDA2",
  "this.overlay_9F943336_8CBF_043B_41E0_49B13BCA640D",
  "this.panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 129,
  "yaw": 41.79,
  "class": "PanoramaCameraPosition",
  "pitch": 5.3
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_81F1C39F_B2B1_686F_41B7_996181CE850E"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "hfov": 145,
  "yaw": 58.28,
  "class": "PanoramaCameraPosition",
  "pitch": -5.53
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_8236D3FD_B2B1_6FB3_41E2_9885E9F27733"
},
{
 "class": "Video",
 "label": "LOJA 01",
 "scaleMode": "fit_inside",
 "thumbnailUrl": "media/video_8C811B07_93F1_29C9_41D9_B94085F2D89C_t.jpg",
 "width": 1280,
 "loop": false,
 "id": "video_8C811B07_93F1_29C9_41D9_B94085F2D89C",
 "height": 720,
 "video": {
  "width": 1280,
  "height": 720,
  "class": "VideoResource",
  "mp4Url": "media/video_8C811B07_93F1_29C9_41D9_B94085F2D89C.mp4"
 }
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -146.79,
  "class": "PanoramaCameraPosition",
  "pitch": -3.19
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -154.5,
  "class": "PanoramaCameraPosition",
  "pitch": -8.54
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_camera"
},
{
 "rotationY": 0,
 "yaw": -146.19,
 "showDuration": 500,
 "class": "PopupPanoramaOverlay",
 "hfov": 11.33,
 "autoplay": true,
 "id": "popup_88F25FC8_9EF1_2443_41CE_E64CF76003F2",
 "rotationX": 0,
 "rotationZ": 0,
 "showEasing": "cubic_in",
 "hideEasing": "cubic_out",
 "loop": false,
 "popupMaxHeight": "95%",
 "popupDistance": 100,
 "popupMaxWidth": "95%",
 "hideDuration": 500,
 "pitch": -2.97,
 "video": {
  "width": 1280,
  "height": 720,
  "class": "VideoResource",
  "mp4Url": "media/video_83F9A4B1_8D51_18C9_41CA_C596246C7689.mp4"
 }
},
{
 "items": [
  {
   "media": "this.video_83F9A4B1_8D51_18C9_41CA_C596246C7689",
   "start": "this.viewer_uid81B37341_B2B1_68D3_41E3_027541A971BAVideoPlayer.set('displayPlaybackBar', true); this.changeBackgroundWhilePlay(this.PlayList_B73ACD90_9EDF_64C4_41C6_C914333C4D29, 0, '#000000'); this.pauseGlobalAudiosWhilePlayItem(this.PlayList_B73ACD90_9EDF_64C4_41C6_C914333C4D29, 0)",
   "class": "VideoPlayListItem",
   "begin": "this.fixTogglePlayPauseButton(this.viewer_uid81B37341_B2B1_68D3_41E3_027541A971BAVideoPlayer)",
   "player": "this.viewer_uid81B37341_B2B1_68D3_41E3_027541A971BAVideoPlayer"
  }
 ],
 "id": "PlayList_B73ACD90_9EDF_64C4_41C6_C914333C4D29",
 "class": "PlayList"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8614AA68_8C95_0457_41C4_75E622B27531"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE"
  }
 ],
 "class": "Panorama",
 "hfov": 360,
 "partial": false,
 "id": "panorama_86154962_8C95_045B_41A2_0938ED55B232",
 "thumbnailUrl": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_t.jpg",
 "label": "SAM_101_2958",
 "pitch": 0,
 "hfovMax": 130,
 "hfovMin": "150%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_9C9E21AF_8CAD_0429_41C0_78AA2439C8AF",
  "this.overlay_9D007086_8CB3_04DB_41E1_199454F6E5B9",
  "this.panorama_86154962_8C95_045B_41A2_0938ED55B232_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 45.76,
  "class": "PanoramaCameraPosition",
  "pitch": -1.52
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_camera"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86154962_8C95_045B_41A2_0938ED55B232"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF"
  }
 ],
 "class": "Panorama",
 "hfov": 360,
 "partial": false,
 "id": "panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE",
 "thumbnailUrl": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_t.jpg",
 "label": "DENTRO DA LOJA",
 "pitch": 0,
 "hfovMax": 140,
 "hfovMin": "164%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_9C8A06CA_8CAD_0C6B_41B2_5399428006C6",
  "this.overlay_9DCA6A04_8CAD_07DF_41A1_415365BA5DE4",
  "this.panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_tcap0",
  "this.overlay_88C8C09C_9ED1_1CFC_41E0_E421CF1F303C"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -107.04,
  "class": "PanoramaCameraPosition",
  "pitch": -7.74
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_820B83AF_B2B1_6FAF_41E0_60CF0B43D662"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 25.09,
  "class": "PanoramaCameraPosition",
  "pitch": -4.19
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 34.9,
  "class": "PanoramaCameraPosition",
  "pitch": 1.84
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_822983CE_B2B1_6FD1_41D0_9DD1D4CA335B"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -98.73,
  "class": "PanoramaCameraPosition",
  "pitch": -7.79
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_camera"
},
{
 "viewerArea": "this.MainViewer",
 "id": "MainViewerVideoPlayer",
 "displayPlaybackBar": true,
 "class": "VideoPlayer"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41"
  }
 ],
 "class": "Panorama",
 "hfov": 360,
 "partial": false,
 "id": "panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63",
 "thumbnailUrl": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_t.jpg",
 "label": "SAM_101_2965",
 "pitch": 0,
 "hfovMax": 135,
 "hfovMin": "150%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_99CC5E40_8CB7_3C57_4184_EDA13DB3FAC0",
  "this.panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_tcap0",
  "this.overlay_8EAD2DEF_93F7_2859_41D7_BC843D94EBD4",
  "this.overlay_8CF7BD68_93F3_2847_41E1_0FC1D9D338C1"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 45.76,
  "class": "PanoramaCameraPosition",
  "pitch": -1.52
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_81F9D39F_B2B1_686F_41B5_4EE310C092AB"
},
{
 "duration": 200,
 "id": "effect_406C8EDB_5426_70A1_41AB_C419AD03A638",
 "easing": "quad_out",
 "class": "FadeOutEffect"
},
{
 "duration": 200,
 "id": "effect_4016129C_5467_90A7_41B5_2C5E462A0C83",
 "easing": "quad_out",
 "class": "FadeOutEffect"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -146.79,
  "class": "PanoramaCameraPosition",
  "pitch": -3.19
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_8263641C_B2B1_6871_41D8_7A40C9C1C6BE"
},
{
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86F878D5_8C95_0479_41CD_5CDFE5265804"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_86F99BB0_8C95_0437_41D3_944ADD73F375"
  }
 ],
 "class": "Panorama",
 "hfov": 360,
 "partial": false,
 "id": "panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499",
 "thumbnailUrl": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_t.jpg",
 "label": "SAM_101_2968",
 "pitch": 0,
 "hfovMax": 130,
 "hfovMin": "150%",
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_t.jpg",
   "class": "CubicPanoramaFrame"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_9A5CA91A_8CAF_05EB_4124_870C8DF52400",
  "this.overlay_9A5F24FF_8CAF_0C2A_41C5_7DBCDD81E2C1",
  "this.overlay_9A40D0F7_8CAD_0439_41BF_D1D361772769",
  "this.panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -132,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_camera"
},
{
 "progressBarBorderColor": "#000000",
 "class": "ViewerArea",
 "progressBackgroundColorDirection": "vertical",
 "id": "MainViewer",
 "left": 0,
 "toolTipShadowSpread": 0,
 "playbackBarHeadOpacity": 1,
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressBorderColor": "#000000",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipBorderColor": "#767676",
 "playbackBarBottom": 5,
 "width": "100%",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "paddingLeft": 0,
 "toolTipFontSize": "1.11vmin",
 "toolTipOpacity": 1,
 "toolTipShadowBlurRadius": 3,
 "minHeight": 50,
 "toolTipTextShadowColor": "#000000",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 4,
 "minWidth": 100,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "toolTipFontWeight": "normal",
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionMode": "blending",
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipShadowOpacity": 1,
 "progressLeft": 0,
 "toolTipShadowHorizontalLength": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "shadow": false,
 "playbackBarBorderSize": 0,
 "toolTipShadowVerticalLength": 0,
 "playbackBarHeadShadowVerticalLength": 0,
 "propagateClick": false,
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontStyle": "normal",
 "toolTipFontFamily": "Arial",
 "vrPointerSelectionColor": "#FF6600",
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "borderSize": 0,
 "paddingRight": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadow": true,
 "progressBottom": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "progressHeight": 10,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "top": 0,
 "playbackBarOpacity": 1,
 "bottom": "8.74%",
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "vrPointerColor": "#FFFFFF",
 "displayTooltipInTouchScreens": true,
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "paddingTop": 0,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "paddingBottom": 0,
 "toolTipPaddingRight": 6,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "transitionDuration": 500,
 "data": {
  "name": "Main Viewer"
 }
},
{
 "transparencyActive": true,
 "class": "IconButton",
 "maxHeight": 50,
 "maxWidth": 50,
 "id": "IconButton_95550FCB_8CEE_FC69_41D0_8D677C4437ED",
 "left": 284,
 "propagateClick": true,
 "width": 44,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 1,
 "verticalAlign": "middle",
 "top": "47.6%",
 "iconURL": "skin/IconButton_95550FCB_8CEE_FC69_41D0_8D677C4437ED.png",
 "bottom": "46.94%",
 "minWidth": 1,
 "mode": "push",
 "rollOverIconURL": "skin/IconButton_95550FCB_8CEE_FC69_41D0_8D677C4437ED_rollover.png",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "visible": false,
 "data": {
  "name": "IconButton collapse"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "class": "Container",
 "scrollBarWidth": 10,
 "id": "Container_9FCE5336_8D57_19CA_41C4_62A2857AE04F",
 "propagateClick": false,
 "width": 330,
 "scrollBarColor": "#000000",
 "right": "35.28%",
 "layout": "absolute",
 "children": [
  "this.Container_9FC90333_8D57_19CA_41E0_DFF82015945B",
  "this.Container_9FC8F333_8D57_19CA_41D0_BE62334C24F7"
 ],
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "horizontalAlign": "left",
 "minHeight": 1,
 "top": "0%",
 "scrollBarOpacity": 0.5,
 "contentOpaque": false,
 "minWidth": 1,
 "verticalAlign": "top",
 "height": "100%",
 "scrollBarMargin": 2,
 "gap": 10,
 "creationPolicy": "inAdvance",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "visible": false,
 "data": {
  "name": "--- LEFT PANEL 5"
 },
 "overflow": "scroll",
 "shadow": false
},
{
 "class": "Container",
 "scrollBarWidth": 10,
 "id": "Container_9FC8C333_8D57_19CA_41DB_491C9DF20604",
 "left": "1.45%",
 "backgroundColorRatios": [
  0.1
 ],
 "propagateClick": true,
 "width": 284,
 "scrollBarColor": "#000000",
 "layout": "absolute",
 "children": [
  "this.Container_9FC88333_8D57_19CA_41C8_C49576B43C9A",
  "this.Container_9FCF6335_8D57_19CE_41D1_C2C82F4FB74F",
  "this.Image_99C7A5DB_8D73_187A_41CB_7133B76A2336"
 ],
 "borderSize": 0,
 "paddingRight": 40,
 "paddingLeft": 40,
 "backgroundColorDirection": "vertical",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.72,
 "contentOpaque": false,
 "minWidth": 1,
 "verticalAlign": "top",
 "backgroundColor": [
  "#000000"
 ],
 "horizontalAlign": "left",
 "click": "this.setComponentVisibility(this.IconButton_95550FCB_8CEE_FC69_41D0_8D677C4437ED, true, 0, null, null, false)",
 "scrollBarMargin": 2,
 "height": "100%",
 "top": "0%",
 "gap": 10,
 "creationPolicy": "inAdvance",
 "paddingTop": 40,
 "paddingBottom": 40,
 "backgroundOpacity": 0.43,
 "borderRadius": 0,
 "visible": false,
 "data": {
  "name": "- Buttons set"
 },
 "overflow": "scroll",
 "shadow": false
},
{
 "class": "Container",
 "scrollBarWidth": 10,
 "id": "Container_80D7D5AB_8D76_EDC1_41D4_A762D2B0D8E7",
 "left": "0%",
 "propagateClick": false,
 "scrollBarColor": "#000000",
 "right": "0%",
 "layout": "absolute",
 "scrollBarOpacity": 0.5,
 "children": [
  "this.Image_80D075AB_8D76_EDC1_41DF_1A208B4A85EA",
  "this.Container_80D045AB_8D76_EDC1_41D8_5B1B88AB15C5",
  "this.IconButton_80D7C5AB_8D76_EDC1_41C9_879925DF7049"
 ],
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "backgroundImageUrl": "skin/Container_80D7D5AB_8D76_EDC1_41D4_A762D2B0D8E7.png",
 "horizontalAlign": "left",
 "minHeight": 1,
 "bottom": "0%",
 "contentOpaque": false,
 "minWidth": 1,
 "height": "12.832%",
 "scrollBarMargin": 2,
 "verticalAlign": "top",
 "gap": 10,
 "creationPolicy": "inAdvance",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0.6,
 "borderRadius": 0,
 "visible": false,
 "data": {
  "name": "--- MENU"
 },
 "overflow": "visible",
 "shadow": false
},
{
 "class": "UIComponent",
 "id": "veilPopupPanorama",
 "left": 0,
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "right": 0,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical",
 "minHeight": 0,
 "bottom": 0,
 "minWidth": 0,
 "backgroundColor": [
  "#000000"
 ],
 "top": 0,
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0.55,
 "borderRadius": 0,
 "visible": false,
 "showEffect": {
  "duration": 350,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "data": {
  "name": "UIComponent54956"
 },
 "shadow": false
},
{
 "class": "ZoomImage",
 "id": "zoomImagePopupPanorama",
 "left": 0,
 "backgroundColorRatios": [],
 "propagateClick": false,
 "right": 0,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical",
 "minHeight": 0,
 "bottom": 0,
 "minWidth": 0,
 "backgroundColor": [],
 "top": 0,
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 1,
 "scaleMode": "custom",
 "borderRadius": 0,
 "visible": false,
 "data": {
  "name": "ZoomImage54957"
 },
 "shadow": false
},
{
 "shadowSpread": 1,
 "class": "CloseButton",
 "data": {
  "name": "CloseButton54958"
 },
 "textDecoration": "none",
 "id": "closeButtonPopupPanorama",
 "rollOverIconColor": "#666666",
 "backgroundColorRatios": [
  0,
  0.1,
  1
 ],
 "propagateClick": false,
 "shadowColor": "#000000",
 "fontFamily": "Arial",
 "right": 10,
 "fontColor": "#FFFFFF",
 "borderSize": 0,
 "paddingRight": 5,
 "layout": "horizontal",
 "iconHeight": 20,
 "paddingLeft": 5,
 "backgroundColorDirection": "vertical",
 "minHeight": 0,
 "borderColor": "#000000",
 "horizontalAlign": "center",
 "verticalAlign": "middle",
 "iconColor": "#000000",
 "iconLineWidth": 5,
 "minWidth": 0,
 "mode": "push",
 "backgroundColor": [
  "#DDDDDD",
  "#EEEEEE",
  "#FFFFFF"
 ],
 "fontSize": "1.29vmin",
 "label": "",
 "shadowBlurRadius": 6,
 "top": 10,
 "gap": 5,
 "fontStyle": "normal",
 "pressedIconColor": "#888888",
 "paddingTop": 5,
 "paddingBottom": 5,
 "backgroundOpacity": 0.3,
 "borderRadius": 0,
 "visible": false,
 "showEffect": {
  "duration": 350,
  "easing": "cubic_in_out",
  "class": "FadeInEffect"
 },
 "iconBeforeLabel": true,
 "iconWidth": 20,
 "shadow": false,
 "cursor": "hand",
 "fontWeight": "normal"
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.setCameraSameSpotAsMedia(this.camera_828AF43B_B2B1_68B7_41D1_7425603622F1, this.panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5); this.startPanoramaWithCamera(this.panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41, this.camera_828AF43B_B2B1_68B7_41D1_7425603622F1); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 05a"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 23.44,
   "pitch": -13.63,
   "yaw": -49.87,
   "image": "this.AnimatedImageResource_9A2F2E29_8C95_FC29_41DC_7AF638A9DDD5",
   "distance": 100
  }
 ],
 "id": "overlay_990D2AAD_8CB5_0429_41CB_F42AFA56DC08",
 "maps": [
  {
   "hfov": 23.44,
   "yaw": -49.87,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_1_HS_0_0_0_map.gif",
      "width": 21,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -13.63,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.setCameraSameSpotAsMedia(this.camera_827EE42C_B2B1_6851_41DF_F0AF2C3BA681, this.panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5); this.startPanoramaWithCamera(this.panorama_86F878D5_8C95_0479_41CD_5CDFE5265804, this.camera_827EE42C_B2B1_6851_41DF_F0AF2C3BA681); this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 01b"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 20.26,
   "pitch": -16.27,
   "yaw": -138.55,
   "image": "this.AnimatedImageResource_9A2FEE29_8C95_FC29_418D_6CBEB4265E13",
   "distance": 100
  }
 ],
 "id": "overlay_99EA0F9D_8CB5_1CE9_41E0_65046562AE94",
 "maps": [
  {
   "hfov": 20.26,
   "yaw": -138.55,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_1_HS_1_0_0_map.gif",
      "width": 29,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -16.27,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_tcap0.png",
    "width": 1000,
    "height": 1000,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 42,
 "id": "panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_tcap0",
 "distance": 43.17,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.setCameraSameSpotAsMedia(this.camera_820B83AF_B2B1_6FAF_41E0_60CF0B43D662, this.panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4); this.startPanoramaWithCamera(this.panorama_8614AA68_8C95_0457_41C4_75E622B27531, this.camera_820B83AF_B2B1_6FAF_41E0_60CF0B43D662); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 05a"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 22.47,
   "pitch": -26.57,
   "yaw": 49.11,
   "image": "this.AnimatedImageResource_9A2EBE29_8C95_FC29_41C1_6ABEB74D5847",
   "distance": 100
  }
 ],
 "id": "overlay_9E02C583_8CB3_0CD9_41DE_EB74E1F83FB9",
 "maps": [
  {
   "hfov": 22.47,
   "yaw": 49.11,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_1_HS_0_0_0_map.gif",
      "width": 21,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -26.57,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.setCameraSameSpotAsMedia(this.camera_81F1C39F_B2B1_686F_41B7_996181CE850E, this.panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4); this.startPanoramaWithCamera(this.panorama_861034B5_8C95_0C39_41CE_711600E16501, this.camera_81F1C39F_B2B1_686F_41B7_996181CE850E); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 05a"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 21.85,
   "pitch": -37.75,
   "yaw": -125.48,
   "image": "this.AnimatedImageResource_9A2E8E29_8C95_FC29_41E0_393F8A721547",
   "distance": 100
  }
 ],
 "id": "overlay_98B70611_8CB3_0FF9_41D2_258D4A23A9B9",
 "maps": [
  {
   "hfov": 21.85,
   "yaw": -125.48,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_1_HS_1_0_0_map.gif",
      "width": 21,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -37.75,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_tcap0.png",
    "width": 1000,
    "height": 1000,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 42,
 "id": "panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_tcap0",
 "distance": 43.17,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.openLink('http://https://www.instagram.com/bateriasok/', '_blank')",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Imagem"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 13.12,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_0_HS_2_0.png",
      "width": 225,
      "height": 278,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -27.7,
   "yaw": 125.86
  }
 ],
 "id": "overlay_88D16009_9ED2_FBC5_41BB_54640CDF2382",
 "maps": [
  {
   "hfov": 13.12,
   "yaw": 125.86,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_0_HS_2_0_0_map.gif",
      "width": 16,
      "height": 19,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -27.7,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B, this.camera_82EE3489_B2B1_6853_41C9_231956DB5F0D); this.mainPlayList.set('selectedIndex', 6); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 05a"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 22.7,
   "pitch": -16.02,
   "yaw": -80.01,
   "image": "this.AnimatedImageResource_9A2E6E29_8C95_FC29_41D7_EFB2F4D1E5FD",
   "distance": 100
  }
 ],
 "id": "overlay_98B2D936_8CBF_043B_41B3_0214C7717C0B",
 "maps": [
  {
   "hfov": 22.7,
   "yaw": -80.01,
   "image": {
    "levels": [
     {
      "url": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_1_HS_0_0_0_map.gif",
      "width": 21,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -16.02,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 8); this.mainPlayList.set('selectedIndex', 8); this.mainPlayList.set('selectedIndex', 9); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 04a"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 24.74,
   "pitch": -17.65,
   "yaw": 38.73,
   "image": "this.AnimatedImageResource_9A2E3E29_8C95_FC29_41CD_35E0C81F2CC9",
   "distance": 100
  }
 ],
 "id": "overlay_9F6894AC_8CBD_0C2F_41DC_DAB9A4844586",
 "maps": [
  {
   "hfov": 24.74,
   "yaw": 38.73,
   "image": {
    "levels": [
     {
      "url": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_1_HS_1_0_0_map.gif",
      "width": 22,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -17.65,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_tcap0.png",
    "width": 1000,
    "height": 1000,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 42,
 "id": "panorama_861034B5_8C95_0C39_41CE_711600E16501_tcap0",
 "distance": 43.17,
 "inertia": false
},
{
 "progressBarBorderColor": "#000000",
 "class": "ViewerArea",
 "progressBackgroundColorDirection": "vertical",
 "id": "viewer_uid81C98351_B2B1_68F3_41BB_2BA21B69775D",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipShadowSpread": 0,
 "playbackBarHeadOpacity": 1,
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressBorderColor": "#000000",
 "toolTipBorderColor": "#767676",
 "playbackBarBottom": 0,
 "width": "100%",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "paddingLeft": 0,
 "minHeight": 50,
 "toolTipOpacity": 1,
 "toolTipShadowBlurRadius": 3,
 "toolTipFontSize": "1.11vmin",
 "toolTipTextShadowColor": "#000000",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 4,
 "minWidth": 100,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "toolTipFontWeight": "normal",
 "height": "100%",
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionMode": "blending",
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipShadowOpacity": 1,
 "progressLeft": 0,
 "toolTipShadowHorizontalLength": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "shadow": false,
 "playbackBarBorderSize": 0,
 "toolTipShadowVerticalLength": 0,
 "playbackBarHeadShadowVerticalLength": 0,
 "propagateClick": false,
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontStyle": "normal",
 "toolTipFontFamily": "Arial",
 "vrPointerSelectionColor": "#FF6600",
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "borderSize": 0,
 "paddingRight": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadow": true,
 "progressBottom": 2,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "progressHeight": 10,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "paddingTop": 0,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "paddingBottom": 0,
 "toolTipPaddingRight": 6,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "transitionDuration": 500,
 "data": {
  "name": "ViewerArea54955"
 }
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.setCameraSameSpotAsMedia(this.camera_8296644B_B2B1_68D7_41E3_468B7E60E349, this.panorama_8614519F_8C95_04E9_41E0_BD41479F0428); this.startPanoramaWithCamera(this.panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4, this.camera_8296644B_B2B1_68D7_41E3_468B7E60E349); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 06a"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 18.58,
   "pitch": -21.42,
   "yaw": -137.11,
   "image": "this.AnimatedImageResource_9A2D8E29_8C95_FC29_41BF_35ADF5A68ED9",
   "distance": 100
  }
 ],
 "id": "overlay_9CF37AE0_8CAF_0457_41BF_1B91186C72F8",
 "maps": [
  {
   "hfov": 18.58,
   "yaw": -137.11,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_1_HS_0_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -21.42,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.setCameraSameSpotAsMedia(this.camera_8287744B_B2B1_68D7_41D7_1093EC663157, this.panorama_8614519F_8C95_04E9_41E0_BD41479F0428); this.startPanoramaWithCamera(this.panorama_86154962_8C95_045B_41A2_0938ED55B232, this.camera_8287744B_B2B1_68D7_41D7_1093EC663157); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 04c"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 18.95,
   "pitch": -24.68,
   "yaw": 47.23,
   "image": "this.AnimatedImageResource_9A2E5E29_8C95_FC29_41DA_1445A290BFCA",
   "distance": 100
  }
 ],
 "id": "overlay_9EC7AFF2_8CB3_3C3B_41CB_E9AC969236FC",
 "maps": [
  {
   "hfov": 18.95,
   "yaw": 47.23,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_1_HS_1_0_0_map.gif",
      "width": 38,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -24.68,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_tcap0.png",
    "width": 1000,
    "height": 1000,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 42,
 "id": "panorama_8614519F_8C95_04E9_41E0_BD41479F0428_tcap0",
 "distance": 43.17,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 01b"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 19.88,
   "pitch": -24.56,
   "yaw": 44.72,
   "image": "this.AnimatedImageResource_92800DD2_8C95_3C7B_4170_FACED9E245AC",
   "distance": 100
  }
 ],
 "id": "overlay_9B6E6788_8C95_0CD7_41D5_67C94075418C",
 "maps": [
  {
   "hfov": 19.88,
   "yaw": 44.72,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_0_HS_0_0_0_map.gif",
      "width": 29,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -24.56,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 24.92,
   "pitch": -19.78,
   "yaw": 147.27,
   "image": "this.AnimatedImageResource_92806DD2_8C95_3C7B_41DC_E288BA402516",
   "distance": 100
  }
 ],
 "id": "overlay_943241C0_8C95_0457_41DA_DDDC68BD7739",
 "maps": [
  {
   "hfov": 24.92,
   "yaw": 147.27,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_0_HS_1_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -19.78,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_tcap0.png",
    "width": 1000,
    "height": 1000,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 42,
 "id": "panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_tcap0",
 "distance": 43.17,
 "inertia": false
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_tcap0.png",
    "width": 1000,
    "height": 1000,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 42,
 "id": "panorama_86E7127F_8C93_0429_41D7_F100BCD60333_tcap0",
 "distance": 43.17,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4, this.camera_8338C4F7_B2B1_69BF_41E3_89DDFC7A7B2D); this.mainPlayList.set('selectedIndex', 14)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 23.16,
   "pitch": -22.8,
   "yaw": 84.54,
   "image": "this.AnimatedImageResource_98862182_8D53_18CB_41D4_948E3722692A",
   "distance": 100
  }
 ],
 "id": "overlay_91D570A9_8CED_04D6_41C5_A31A16AEE232",
 "maps": [
  {
   "hfov": 23.16,
   "yaw": 84.54,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0_HS_0_0_0_map.gif",
      "width": 29,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -22.8,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 19.96,
   "pitch": -25.44,
   "yaw": -84.28,
   "image": "this.AnimatedImageResource_98868182_8D53_18CB_41A0_968029269732",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_93E6BB68_8CEF_0457_41DB_0B79BE6CC335",
 "data": {
  "label": "Arrow 01b"
 },
 "maps": [
  {
   "hfov": 19.96,
   "yaw": -84.28,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0_HS_1_0_0_map.gif",
      "width": 29,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -25.44,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "if(this.isCardboardViewMode()) { this.showPopupPanoramaVideoOverlay(this.popup_B778D61D_9EF7_27FD_4163_BCF3D3447174, {'iconLineWidth':5,'rollOverIconHeight':20,'pressedIconHeight':20,'rollOverIconColor':'#666666','rollOverBorderColor':'#000000','backgroundColorRatios':[0,0.09803921568627451,1],'rollOverIconWidth':20,'pressedBorderSize':0,'rollOverBackgroundOpacity':0.3,'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'borderSize':0,'paddingRight':5,'pressedIconColor':'#888888','backgroundOpacity':0.3,'iconHeight':20,'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'paddingLeft':5,'backgroundColorDirection':'vertical','pressedIconWidth':20,'iconColor':'#000000','paddingTop':5,'rollOverIconLineWidth':5,'pressedBorderColor':'#000000','iconWidth':20,'borderColor':'#000000','rollOverBorderSize':0,'paddingBottom':5,'pressedBackgroundColorRatios':[0,0.09803921568627451,1],'pressedBackgroundColorDirection':'vertical','rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'pressedBackgroundOpacity':0.3,'backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedIconLineWidth':5,'rollOverBackgroundColorDirection':'vertical'}, true) } else { this.showPopupMedia(this.window_B7E5B820_9EF7_2BC4_41DC_5E90BA481160, this.video_8B62C7ED_93D1_1859_41BC_8A8721CAB784, this.PlayList_B73A6D90_9EDF_64C4_41E0_7A938A001F63, '95%', '95%', true, true) }",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Image"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 14.84,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0_HS_2_0.png",
      "width": 225,
      "height": 225,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 3.43,
   "yaw": -36.41
  }
 ],
 "id": "overlay_88F0D308_9EF7_1DC3_41C0_6538BC6CB9A0",
 "maps": [
  {
   "hfov": 14.84,
   "yaw": -36.41,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0_HS_2_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 3.43,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.openLink('http://https://www.instagram.com/bateriasok/', '_blank')",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Imagem"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 13.21,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0_HS_3_0.png",
      "width": 202,
      "height": 248,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -7.35,
   "yaw": 132.39
  }
 ],
 "id": "overlay_B73FAB3D_9ED1_EC3D_41CD_36650EAC00AE",
 "maps": [
  {
   "hfov": 13.21,
   "yaw": 132.39,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0_HS_3_0_0_map.gif",
      "width": 16,
      "height": 19,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -7.35,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "progressBarBorderColor": "#000000",
 "class": "ViewerArea",
 "progressBackgroundColorDirection": "vertical",
 "id": "viewer_uid81B37341_B2B1_68D3_41E3_027541A971BA",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipShadowSpread": 0,
 "playbackBarHeadOpacity": 1,
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressBorderColor": "#000000",
 "toolTipBorderColor": "#767676",
 "playbackBarBottom": 0,
 "width": "100%",
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "paddingLeft": 0,
 "minHeight": 50,
 "toolTipOpacity": 1,
 "toolTipShadowBlurRadius": 3,
 "toolTipFontSize": "1.11vmin",
 "toolTipTextShadowColor": "#000000",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "playbackBarRight": 0,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 4,
 "minWidth": 100,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "toolTipFontWeight": "normal",
 "height": "100%",
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionMode": "blending",
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipShadowOpacity": 1,
 "progressLeft": 0,
 "toolTipShadowHorizontalLength": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "shadow": false,
 "playbackBarBorderSize": 0,
 "toolTipShadowVerticalLength": 0,
 "playbackBarHeadShadowVerticalLength": 0,
 "propagateClick": false,
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontStyle": "normal",
 "toolTipFontFamily": "Arial",
 "vrPointerSelectionColor": "#FF6600",
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "borderSize": 0,
 "paddingRight": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadow": true,
 "progressBottom": 2,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "progressHeight": 10,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "paddingTop": 0,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "paddingBottom": 0,
 "toolTipPaddingRight": 6,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "transitionDuration": 500,
 "data": {
  "name": "ViewerArea54954"
 }
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.setCameraSameSpotAsMedia(this.camera_830BB499_B2B1_6873_41D7_A67CADDD8A7A, this.panorama_86F878D5_8C95_0479_41CD_5CDFE5265804); this.startPanoramaWithCamera(this.panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5, this.camera_830BB499_B2B1_6873_41D7_A67CADDD8A7A); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 01b"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 18.52,
   "pitch": -33.1,
   "yaw": 24.24,
   "image": "this.AnimatedImageResource_9A2F9E29_8C95_FC29_41D7_CFF709ACA0F9",
   "distance": 100
  }
 ],
 "id": "overlay_995AE96B_8CB3_0429_41C7_ACA0244109FB",
 "maps": [
  {
   "hfov": 18.52,
   "yaw": 24.24,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_1_HS_0_0_0_map.gif",
      "width": 29,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -33.1,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.setCameraSameSpotAsMedia(this.camera_82FCB499_B2B1_6873_41B6_EEBE5FE8AA92, this.panorama_86F878D5_8C95_0479_41CD_5CDFE5265804); this.startPanoramaWithCamera(this.panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499, this.camera_82FCB499_B2B1_6873_41B6_EEBE5FE8AA92); this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 01b"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 20.29,
   "pitch": -34.48,
   "yaw": -145.08,
   "image": "this.AnimatedImageResource_9A286E29_8C95_FC29_41C6_9786975BDFA2",
   "distance": 100
  }
 ],
 "id": "overlay_9A777E9E_8CB3_3CEB_41D3_B04C146C244D",
 "maps": [
  {
   "hfov": 20.29,
   "yaw": -145.08,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_1_HS_1_0_0_map.gif",
      "width": 29,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -34.48,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_tcap0.png",
    "width": 1000,
    "height": 1000,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 42,
 "id": "panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_tcap0",
 "distance": 43.17,
 "inertia": false
},
{
 "transparencyActive": true,
 "class": "IconButton",
 "maxHeight": 37,
 "maxWidth": 49,
 "id": "IconButton_80D7C5AB_8D76_EDC1_41C9_879925DF7049",
 "propagateClick": false,
 "width": 49,
 "right": 30,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 1,
 "verticalAlign": "middle",
 "iconURL": "skin/IconButton_80D7C5AB_8D76_EDC1_41C9_879925DF7049.png",
 "bottom": 8,
 "minWidth": 1,
 "mode": "push",
 "height": 37,
 "rollOverIconURL": "skin/IconButton_80D7C5AB_8D76_EDC1_41C9_879925DF7049_rollover.png",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "visible": false,
 "data": {
  "name": "IconButton VR"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.setCameraSameSpotAsMedia(this.camera_820493BE_B2B1_6FB1_41DA_58982EA9CEFC, this.panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41); this.startPanoramaWithCamera(this.panorama_861034B5_8C95_0C39_41CE_711600E16501, this.camera_820493BE_B2B1_6FB1_41DA_58982EA9CEFC); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 06"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 19.28,
   "pitch": -14.51,
   "yaw": -78.1,
   "image": "this.AnimatedImageResource_9A2E0E29_8C95_FC29_41D8_4C6DF76A4A9E",
   "distance": 100
  }
 ],
 "id": "overlay_988BE1F9_8CB3_0429_41C6_E5C5E2E5B204",
 "maps": [
  {
   "hfov": 19.28,
   "yaw": -78.1,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_1_HS_0_0_0_map.gif",
      "width": 30,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -14.51,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63, this.camera_822983CE_B2B1_6FD1_41D0_9DD1D4CA335B); this.mainPlayList.set('selectedIndex', 9); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 05a"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 25.71,
   "pitch": -32.97,
   "yaw": 158.39,
   "image": "this.AnimatedImageResource_9A2ECE29_8C95_FC29_41D5_DA7B79596ECC",
   "distance": 100
  }
 ],
 "id": "overlay_98FF835A_8CB3_046B_41D9_15CF9E0DBCB2",
 "maps": [
  {
   "hfov": 25.71,
   "yaw": 158.39,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_1_HS_1_0_0_map.gif",
      "width": 21,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -32.97,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5, this.camera_823D83ED_B2B1_6FD3_41E1_E10207FC816E); this.mainPlayList.set('selectedIndex', 10); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 01b"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 18.58,
   "pitch": -18.53,
   "yaw": 59.16,
   "image": "this.AnimatedImageResource_9A2E9E29_8C95_FC29_41CB_7559A788ECEB",
   "distance": 100
  }
 ],
 "id": "overlay_98BC321C_8CB7_07EF_41C7_21A21E1ADF44",
 "maps": [
  {
   "hfov": 18.58,
   "yaw": 59.16,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_1_HS_2_0_0_map.gif",
      "width": 29,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -18.53,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_tcap0.png",
    "width": 1000,
    "height": 1000,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 42,
 "id": "panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_tcap0",
 "distance": 43.17,
 "inertia": false
},
{
 "viewerArea": "this.viewer_uid81C98351_B2B1_68F3_41BB_2BA21B69775D",
 "id": "viewer_uid81C98351_B2B1_68F3_41BB_2BA21B69775DVideoPlayer",
 "displayPlaybackBar": true,
 "class": "VideoPlayer"
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_tcap0.png",
    "width": 1000,
    "height": 1000,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 42,
 "id": "panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_tcap0",
 "distance": 43.17,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4, this.camera_824133FD_B2B1_6FB3_41DD_D74A8DE9169F); this.mainPlayList.set('selectedIndex', 14)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 20.37,
   "pitch": -45.66,
   "yaw": 50.62,
   "image": "this.AnimatedImageResource_9887A181_8D53_18C9_41DA_08A8581BAF3F",
   "distance": 100
  }
 ],
 "id": "overlay_90378848_8CED_0457_41D6_05E54761A745",
 "maps": [
  {
   "hfov": 20.37,
   "yaw": 50.62,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_0_HS_0_0_0_map.gif",
      "width": 29,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -45.66,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "class": "VideoPanoramaOverlay",
 "video": {
  "width": 1280,
  "height": 720,
  "class": "VideoResource",
  "mp4Url": "media/video_8B62C7ED_93D1_1859_41BC_8A8721CAB784.mp4"
 },
 "hfov": 27.35,
 "autoplay": true,
 "id": "overlay_8B4913E8_93D3_1847_41B5_6D4EBAF09FAA",
 "blending": 0,
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "levels": [
   {
    "url": "media/overlay_8B4913E8_93D3_1847_41B5_6D4EBAF09FAA_t.jpg",
    "width": 1280,
    "height": 720,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "pitch": 34.52,
 "useHandCursor": true,
 "roll": 8.38,
 "yaw": -30.71,
 "rotationY": -12.86,
 "rotationX": -33.17,
 "click": "this.overlay_8B4913E8_93D3_1847_41B5_6D4EBAF09FAA.stop()",
 "videoVisibleOnStop": false,
 "data": {
  "label": "Video"
 },
 "vfov": 19.76,
 "distance": 50
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.setCameraSameSpotAsMedia(this.camera_831A34A9_B2B1_6853_41D4_F84CD9670FAC, this.panorama_8614AA68_8C95_0457_41C4_75E622B27531); this.startPanoramaWithCamera(this.panorama_8614519F_8C95_04E9_41E0_BD41479F0428, this.camera_831A34A9_B2B1_6853_41D4_F84CD9670FAC); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 05a"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 16.11,
   "pitch": -31.21,
   "yaw": 83.15,
   "image": "this.AnimatedImageResource_9A2E2E29_8C95_FC29_41D7_431C77D790EE",
   "distance": 100
  }
 ],
 "id": "overlay_9E2ED4CF_8CB5_0C69_41DE_AAE51F8E6353",
 "maps": [
  {
   "hfov": 16.11,
   "yaw": 83.15,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_1_HS_0_0_0_map.gif",
      "width": 21,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -31.21,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.setCameraSameSpotAsMedia(this.camera_832874E7_B2B1_69DF_41E3_9196655D4EAA, this.panorama_8614AA68_8C95_0457_41C4_75E622B27531); this.startPanoramaWithCamera(this.panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B, this.camera_832874E7_B2B1_69DF_41E3_9196655D4EAA); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 05a"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 21.1,
   "pitch": -35.36,
   "yaw": -109.78,
   "image": "this.AnimatedImageResource_9A2EFE29_8C95_FC29_41DC_82B7037C34E2",
   "distance": 100
  }
 ],
 "id": "overlay_9EC16294_8CB7_04FF_41D3_6B1C1FED06C0",
 "maps": [
  {
   "hfov": 21.1,
   "yaw": -109.78,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_1_HS_1_0_0_map.gif",
      "width": 21,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -35.36,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_tcap0.png",
    "width": 1000,
    "height": 1000,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 42,
 "id": "panorama_8614AA68_8C95_0457_41C4_75E622B27531_tcap0",
 "distance": 43.17,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.openLink('http://https://www.instagram.com/p/B9Rw5DcHFSJ/?utm_source=ig_web_copy_link', '_blank')",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Image"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 26.99,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_0_HS_2_0.png",
      "width": 410,
      "height": 368,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0.51,
   "yaw": -43.16
  }
 ],
 "id": "overlay_B7232AD5_9ED1_6C4D_41D3_0A3EBFC5FB6C",
 "maps": [
  {
   "hfov": 26.99,
   "yaw": -43.16,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_0_HS_2_0_0_map.gif",
      "width": 17,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0.51,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.setCameraSameSpotAsMedia(this.camera_82A4F45A_B2B1_68F6_41E2_719DAACF7F60, this.panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF); this.startPanoramaWithCamera(this.panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE, this.camera_82A4F45A_B2B1_68F6_41E2_719DAACF7F60); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 06b"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 13.82,
   "pitch": -23.55,
   "yaw": -120.96,
   "image": "this.AnimatedImageResource_9A238E29_8C95_FC29_41D0_37C37AF6F261",
   "distance": 100
  }
 ],
 "id": "overlay_82B0A39F_8C95_04E9_41DB_D90F801CDA75",
 "maps": [
  {
   "hfov": 13.82,
   "yaw": -120.96,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_1_HS_0_0_0_map.gif",
      "width": 32,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -23.55,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "hfov": 42,
 "id": "panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_tcap0",
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_tcap0.png",
    "width": 1000,
    "height": 1000,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "rotate": false,
 "click": "this.openLink('http://https://www.instagram.com/smartdigitalvc/', '_blank')",
 "distance": 43.17,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.setCameraSameSpotAsMedia(this.camera_82B2746A_B2B1_68D1_41D0_CD225201D372, this.panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF); this.startPanoramaWithCamera(this.panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4, this.camera_82B2746A_B2B1_68D1_41D0_CD225201D372); this.mainPlayList.set('selectedIndex', 14)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Imagem"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 43.51,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0_HS_1_0.png",
      "width": 747,
      "height": 644,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 27.84,
   "yaw": 22.47
  }
 ],
 "id": "overlay_839C054B_8D53_3859_41BA_9DEEB4A922DA",
 "maps": [
  {
   "hfov": 43.51,
   "yaw": 22.47,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0_HS_1_0_0_map.gif",
      "width": 18,
      "height": 15,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 27.84,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.setCameraSameSpotAsMedia(this.camera_82C1447A_B2B1_68B1_41DC_4F784757F17A, this.panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF); this.startPanoramaWithCamera(this.panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4, this.camera_82C1447A_B2B1_68B1_41DC_4F784757F17A); this.mainPlayList.set('selectedIndex', 14)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 06"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 22.06,
   "pitch": 5.97,
   "yaw": 18.75,
   "image": "this.AnimatedImageResource_98942173_8D53_1849_41D3_E168DC171049",
   "distance": 100
  }
 ],
 "id": "overlay_8289837D_8D51_183E_41A2_04F9911F61B2",
 "maps": [
  {
   "hfov": 22.06,
   "yaw": 18.75,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0_HS_2_0_0_map.gif",
      "width": 30,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 5.97,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "if(this.isCardboardViewMode()) { this.showPopupPanoramaVideoOverlay(this.popup_88F25FC8_9EF1_2443_41CE_E64CF76003F2, {'iconLineWidth':5,'rollOverIconHeight':20,'pressedIconHeight':20,'rollOverIconColor':'#666666','rollOverBorderColor':'#000000','backgroundColorRatios':[0,0.09803921568627451,1],'rollOverIconWidth':20,'pressedBorderSize':0,'rollOverBackgroundOpacity':0.3,'pressedBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'borderSize':0,'paddingRight':5,'pressedIconColor':'#888888','backgroundOpacity':0.3,'iconHeight':20,'rollOverBackgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'paddingLeft':5,'backgroundColorDirection':'vertical','pressedIconWidth':20,'iconColor':'#000000','paddingTop':5,'rollOverIconLineWidth':5,'pressedBorderColor':'#000000','iconWidth':20,'borderColor':'#000000','rollOverBorderSize':0,'paddingBottom':5,'pressedBackgroundColorRatios':[0,0.09803921568627451,1],'pressedBackgroundColorDirection':'vertical','rollOverBackgroundColorRatios':[0,0.09803921568627451,1],'pressedBackgroundOpacity':0.3,'backgroundColor':['#DDDDDD','#EEEEEE','#FFFFFF'],'pressedIconLineWidth':5,'rollOverBackgroundColorDirection':'vertical'}, true) } else { this.showPopupMedia(this.window_B7147323_9EF1_3DC5_41C0_001A3DCF327E, this.video_83F9A4B1_8D51_18C9_41CA_C596246C7689, this.PlayList_B73ACD90_9EDF_64C4_41C6_C914333C4D29, '95%', '95%', true, true) }",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Image"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 11.33,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0_HS_3_0.png",
      "width": 172,
      "height": 161,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -2.97,
   "yaw": -146.19
  }
 ],
 "id": "overlay_889DB0E2_9EF3_3C47_41DF_0DBA0685232F",
 "maps": [
  {
   "hfov": 11.33,
   "yaw": -146.19,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0_HS_3_0_0_map.gif",
      "width": 17,
      "height": 15,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -2.97,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.openLink('https://linktr.ee/bateriasok', '_blank')",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Info Red 02"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 15.44,
   "pitch": -14.7,
   "yaw": -145.14,
   "image": "this.AnimatedImageResource_B063A06F_9ECF_FC5D_41DD_04192FCFC858",
   "distance": 100
  }
 ],
 "id": "overlay_B76C2874_9ED1_6C43_41B8_9E521CDEEE56",
 "maps": [
  {
   "hfov": 15.44,
   "yaw": -145.14,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0_HS_6_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -14.7,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_tcap0.png",
    "width": 1000,
    "height": 1000,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 42,
 "id": "panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_tcap0",
 "distance": 43.17,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_86E7127F_8C93_0429_41D7_F100BCD60333, this.camera_8336E526_B2B1_6851_41C4_CF99918AD89C); this.mainPlayList.set('selectedIndex', 16)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 01a"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 19.63,
   "pitch": -28.58,
   "yaw": -123.35,
   "image": "this.AnimatedImageResource_9884E181_8D53_18C9_41BA_205F7D9BB81A",
   "distance": 100
  }
 ],
 "id": "overlay_9029B7D5_8CF5_0C79_418C_5663B67351D6",
 "maps": [
  {
   "hfov": 19.63,
   "yaw": -123.35,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0_HS_0_0_0_map.gif",
      "width": 29,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -28.58,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6, this.camera_8346D554_B2B1_68F2_41BA_64CC547D61E5); this.mainPlayList.set('selectedIndex', 15)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 02 Left-Up"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 19.57,
   "pitch": -20.16,
   "yaw": -159.78,
   "image": "this.AnimatedImageResource_9884B181_8D53_18C9_41DC_E0F763D95EDF",
   "distance": 50
  }
 ],
 "id": "overlay_922EE268_8CF3_0457_41CF_287C08445C09",
 "maps": [
  {
   "hfov": 19.57,
   "yaw": -159.78,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0_HS_1_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -20.16,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Imagem"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 24.07,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0_HS_2_0.png",
      "width": 373,
      "height": 507,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 11.76,
   "yaw": -17.73
  }
 ],
 "id": "overlay_82AD6AAA_8D5F_28DB_41CB_B9EF6ECE9BFF",
 "maps": [
  {
   "hfov": 24.07,
   "yaw": -17.73,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0_HS_2_0_0_map.gif",
      "width": 16,
      "height": 21,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 11.76,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 23.72,
   "pitch": -1.07,
   "yaw": -19.42,
   "image": "this.AnimatedImageResource_9887D181_8D53_18C9_41D9_49296248EEE7",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_9FEE3096_8D5F_78CB_41D3_FE0BD10C15A5",
 "data": {
  "label": "Arrow 06a"
 },
 "maps": [
  {
   "hfov": 23.72,
   "yaw": -19.42,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0_HS_3_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -1.07,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.setCameraSameSpotAsMedia(this.camera_8263641C_B2B1_6871_41D8_7A40C9C1C6BE, this.panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B); this.startPanoramaWithCamera(this.panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4, this.camera_8263641C_B2B1_6871_41D8_7A40C9C1C6BE); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 05a"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 23.09,
   "pitch": -25.69,
   "yaw": 47.1,
   "image": "this.AnimatedImageResource_9A2F5E29_8C95_FC29_41DE_8A14BB78A284",
   "distance": 100
  }
 ],
 "id": "overlay_9FB39CB1_8CBD_7C39_41E0_60E6E425DDA2",
 "maps": [
  {
   "hfov": 23.09,
   "yaw": 47.1,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_1_HS_0_0_0_map.gif",
      "width": 21,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -25.69,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_861034B5_8C95_0C39_41CE_711600E16501, this.camera_8257741C_B2B1_6871_41D0_6E6862B8BCDA); this.mainPlayList.set('selectedIndex', 7); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 05a"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 23.92,
   "pitch": -32.6,
   "yaw": -124.1,
   "image": "this.AnimatedImageResource_9A2F1E29_8C95_FC29_4126_8C83950CED10",
   "distance": 100
  }
 ],
 "id": "overlay_9F943336_8CBF_043B_41E0_49B13BCA640D",
 "maps": [
  {
   "hfov": 23.92,
   "yaw": -124.1,
   "image": {
    "levels": [
     {
      "url": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_1_HS_1_0_0_map.gif",
      "width": 21,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -32.6,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_tcap0.png",
    "width": 1000,
    "height": 1000,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 42,
 "id": "panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_tcap0",
 "distance": 43.17,
 "inertia": false
},
{
 "viewerArea": "this.viewer_uid81B37341_B2B1_68D3_41E3_027541A971BA",
 "id": "viewer_uid81B37341_B2B1_68D3_41E3_027541A971BAVideoPlayer",
 "displayPlaybackBar": true,
 "class": "VideoPlayer"
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.setCameraSameSpotAsMedia(this.camera_81DA5361_B2B1_68D3_41E3_7E8594DBA919, this.panorama_86154962_8C95_045B_41A2_0938ED55B232); this.startPanoramaWithCamera(this.panorama_8614AA68_8C95_0457_41C4_75E622B27531, this.camera_81DA5361_B2B1_68D3_41E3_7E8594DBA919); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 06a"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 16.95,
   "pitch": -21.29,
   "yaw": -110.61,
   "image": "this.AnimatedImageResource_9A2DFE29_8C95_FC29_41E0_71786DF8C53F",
   "distance": 100
  }
 ],
 "id": "overlay_9C9E21AF_8CAD_0429_41C0_78AA2439C8AF",
 "maps": [
  {
   "hfov": 16.95,
   "yaw": -110.61,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_1_HS_0_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -21.29,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.setCameraSameSpotAsMedia(this.camera_81DE2370_B2B1_68B1_419D_3AF0457CE4DD, this.panorama_86154962_8C95_045B_41A2_0938ED55B232); this.startPanoramaWithCamera(this.panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE, this.camera_81DE2370_B2B1_68B1_419D_3AF0457CE4DD); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 04a"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 18.49,
   "pitch": -38.75,
   "yaw": 54.18,
   "image": "this.AnimatedImageResource_9A2DCE29_8C95_FC29_41D7_60BAE9B427BE",
   "distance": 100
  }
 ],
 "id": "overlay_9D007086_8CB3_04DB_41E1_199454F6E5B9",
 "maps": [
  {
   "hfov": 18.49,
   "yaw": 54.18,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_1_HS_1_0_0_map.gif",
      "width": 22,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -38.75,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_tcap0.png",
    "width": 1000,
    "height": 1000,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 42,
 "id": "panorama_86154962_8C95_045B_41A2_0938ED55B232_tcap0",
 "distance": 43.17,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.setCameraSameSpotAsMedia(this.camera_81D4F370_B2B1_68B1_41E2_D6915BFB3669, this.panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE); this.startPanoramaWithCamera(this.panorama_86154962_8C95_045B_41A2_0938ED55B232, this.camera_81D4F370_B2B1_68B1_41E2_D6915BFB3669); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 04a"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 20.41,
   "pitch": -30.59,
   "yaw": -105.85,
   "image": "this.AnimatedImageResource_8DE1116B_93D3_785A_41D3_5E38A3EF9159",
   "distance": 100
  }
 ],
 "id": "overlay_9C8A06CA_8CAD_0C6B_41B2_5399428006C6",
 "maps": [
  {
   "hfov": 20.41,
   "yaw": -105.85,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_0_HS_0_0_0_map.gif",
      "width": 22,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -30.59,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.setCameraSameSpotAsMedia(this.camera_81EAB380_B2B1_6851_41C2_7BC599C54A24, this.panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE); this.startPanoramaWithCamera(this.panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF, this.camera_81EAB380_B2B1_6851_41C2_7BC599C54A24); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 06a"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 19.61,
   "pitch": -25.44,
   "yaw": 72.78,
   "image": "this.AnimatedImageResource_9A2D1E29_8C95_FC29_4183_05AF386C7D2F",
   "distance": 100
  }
 ],
 "id": "overlay_9DCA6A04_8CAD_07DF_41A1_415365BA5DE4",
 "maps": [
  {
   "hfov": 19.61,
   "yaw": 72.78,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_1_HS_1_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -25.44,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_tcap0.png",
    "width": 1000,
    "height": 1000,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 42,
 "id": "panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_tcap0",
 "distance": 43.17,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.openLink('http://https://www.instagram.com/p/B_AnVQlDL0t/?utm_source=ig_web_copy_link', '_blank')",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Image"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 13.81,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_0_HS_2_0.png",
      "width": 218,
      "height": 164,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -15.91,
   "yaw": -46.46
  }
 ],
 "id": "overlay_88C8C09C_9ED1_1CFC_41E0_E421CF1F303C",
 "maps": [
  {
   "hfov": 13.81,
   "yaw": -46.46,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_0_HS_2_0_0_map.gif",
      "width": 21,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -15.91,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.setCameraSameSpotAsMedia(this.camera_8236D3FD_B2B1_6FB3_41E2_9885E9F27733, this.panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63); this.startPanoramaWithCamera(this.panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41, this.camera_8236D3FD_B2B1_6FB3_41E2_9885E9F27733); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 01c"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 20.92,
   "pitch": -20.66,
   "yaw": 42.96,
   "image": "this.AnimatedImageResource_9A2F6E29_8C95_FC29_41DD_1D9E8349B4F6",
   "distance": 100
  }
 ],
 "id": "overlay_99CC5E40_8CB7_3C57_4184_EDA13DB3FAC0",
 "maps": [
  {
   "hfov": 20.92,
   "yaw": 42.96,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_1_HS_0_0_0_map.gif",
      "width": 29,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -20.66,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_tcap0.png",
    "width": 1000,
    "height": 1000,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 42,
 "id": "panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_tcap0",
 "distance": 43.17,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 19.96,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_0_HS_2_0.png",
      "width": 306,
      "height": 299,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 21.17,
   "roll": 0,
   "yaw": -24.12
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_8EAD2DEF_93F7_2859_41D7_BC843D94EBD4",
 "data": {
  "label": "Poligono"
 },
 "maps": [
  {
   "hfov": 19.96,
   "yaw": -24.12,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_0_HS_2_1_0_map.gif",
      "width": 153,
      "height": 149,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 21.17,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "class": "VideoPanoramaOverlay",
 "video": {
  "width": 1280,
  "height": 720,
  "class": "VideoResource",
  "mp4Url": "media/video_8C811B07_93F1_29C9_41D9_B94085F2D89C.mp4"
 },
 "hfov": 21.63,
 "autoplay": true,
 "id": "overlay_8CF7BD68_93F3_2847_41E1_0FC1D9D338C1",
 "blending": 0.28,
 "enabledInCardboard": true,
 "loop": false,
 "image": {
  "levels": [
   {
    "url": "media/overlay_8CF7BD68_93F3_2847_41E1_0FC1D9D338C1_t.jpg",
    "width": 1280,
    "height": 720,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "pitch": 21.01,
 "useHandCursor": true,
 "roll": 17.16,
 "yaw": -25.24,
 "rotationY": -30.68,
 "rotationX": -23.95,
 "click": "this.overlay_8CF7BD68_93F3_2847_41E1_0FC1D9D338C1.stop()",
 "videoVisibleOnStop": false,
 "data": {
  "label": "Video"
 },
 "vfov": 13.79,
 "distance": 37.72
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.setCameraSameSpotAsMedia(this.camera_81E0A38F_B2B1_686E_41CD_3798841E987E, this.panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499); this.startPanoramaWithCamera(this.panorama_86F878D5_8C95_0479_41CD_5CDFE5265804, this.camera_81E0A38F_B2B1_686E_41CD_3798841E987E); this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 05a"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 17.04,
   "pitch": -21.67,
   "yaw": 59.04,
   "image": "this.AnimatedImageResource_9A281E29_8C95_FC29_41B4_8590EBC51D10",
   "distance": 100
  }
 ],
 "id": "overlay_9A5CA91A_8CAF_05EB_4124_870C8DF52400",
 "maps": [
  {
   "hfov": 17.04,
   "yaw": 59.04,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_1_HS_0_0_0_map.gif",
      "width": 21,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -21.67,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 0.67,
   "pitch": -39.5,
   "yaw": -21.55,
   "image": "this.AnimatedImageResource_9A28CE39_8C95_FC29_41D4_AE0F913B35B6",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_9A5F24FF_8CAF_0C2A_41C5_7DBCDD81E2C1",
 "data": {
  "label": "Arrow 05c"
 },
 "maps": [
  {
   "hfov": 0.67,
   "yaw": -21.55,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_1_HS_1_0_0_map.gif",
      "width": 34,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -39.5,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.setCameraSameSpotAsMedia(this.camera_81F9D39F_B2B1_686F_41B5_4EE310C092AB, this.panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499); this.startPanoramaWithCamera(this.panorama_86F99BB0_8C95_0437_41D3_944ADD73F375, this.camera_81F9D39F_B2B1_686F_41B5_4EE310C092AB); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Arrow 06a"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 25.42,
   "pitch": -3.96,
   "yaw": -19.04,
   "image": "this.AnimatedImageResource_9A288E39_8C95_FC29_41A2_D694176A5023",
   "distance": 100
  }
 ],
 "id": "overlay_9A40D0F7_8CAD_0439_41BF_D1D361772769",
 "maps": [
  {
   "hfov": 25.42,
   "yaw": -19.04,
   "image": {
    "levels": [
     {
      "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_1_HS_2_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -3.96,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_tcap0.png",
    "width": 1000,
    "height": 1000,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 42,
 "id": "panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_tcap0",
 "distance": 43.17,
 "inertia": false
},
{
 "class": "Container",
 "scrollBarWidth": 10,
 "id": "Container_9FC90333_8D57_19CA_41E0_DFF82015945B",
 "left": "0%",
 "propagateClick": true,
 "width": 66,
 "scrollBarColor": "#000000",
 "layout": "absolute",
 "children": [
  "this.Container_9FC91333_8D57_19CA_41D4_1A521AA2383E"
 ],
 "borderSize": 0,
 "paddingRight": 0,
 "scrollBarVisible": "rollOver",
 "paddingLeft": 0,
 "horizontalAlign": "left",
 "minHeight": 1,
 "top": "0%",
 "scrollBarOpacity": 0.5,
 "contentOpaque": false,
 "minWidth": 1,
 "verticalAlign": "top",
 "creationPolicy": "inAdvance",
 "scrollBarMargin": 2,
 "height": "100%",
 "gap": 10,
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "visible": false,
 "data": {
  "name": "- COLLAPSE"
 },
 "overflow": "scroll",
 "shadow": false
},
{
 "class": "Container",
 "maxHeight": 100,
 "maxWidth": 100,
 "id": "Container_9FC8F333_8D57_19CA_41D0_BE62334C24F7",
 "left": 0,
 "propagateClick": false,
 "width": 330,
 "scrollBarColor": "#000000",
 "scrollBarWidth": 10,
 "layout": "absolute",
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "horizontalAlign": "left",
 "top": "0%",
 "scrollBarOpacity": 0.5,
 "contentOpaque": false,
 "minWidth": 1,
 "verticalAlign": "top",
 "height": "100%",
 "scrollBarMargin": 2,
 "gap": 10,
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "data": {
  "name": "- EXPANDED"
 },
 "overflow": "visible",
 "shadow": false
},
{
 "class": "Container",
 "scrollBarWidth": 6,
 "id": "Container_9FC88333_8D57_19CA_41C8_C49576B43C9A",
 "propagateClick": true,
 "scrollBarColor": "#000000",
 "horizontalAlign": "left",
 "right": "0%",
 "layout": "vertical",
 "scrollBarOpacity": 0.3,
 "children": [
  "this.Button_9FC86333_8D57_19CA_41DF_515BA0A96BFA",
  "this.Container_9FCF8333_8D57_19CA_41D7_08ACA3624D4A",
  "this.Button_9FCF9333_8D57_19CA_41DE_E89CC9C0367F",
  "this.Container_9FC82334_8D57_19CE_41E1_345271A21403",
  "this.Container_9FCF2334_8D57_19CE_41A8_0D253F6B8256",
  "this.Container_9FCED335_8D57_19CE_41E1_0E38E54933D9",
  "this.Container_9FCEA335_8D57_19CE_41DA_FEFA3E81D99B"
 ],
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "verticalAlign": "middle",
 "top": "26%",
 "width": "100%",
 "bottom": "26%",
 "contentOpaque": false,
 "minWidth": 1,
 "scrollBarMargin": 2,
 "gap": 0,
 "creationPolicy": "inAdvance",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "visible": false,
 "data": {
  "name": "-Level 1"
 },
 "overflow": "scroll"
},
{
 "class": "Container",
 "scrollBarWidth": 10,
 "id": "Container_9FCF6335_8D57_19CE_41D1_C2C82F4FB74F",
 "left": "0%",
 "propagateClick": true,
 "scrollBarColor": "#000000",
 "layout": "vertical",
 "scrollBarOpacity": 0.5,
 "children": [
  "this.Container_9FCF4335_8D57_19CE_41D6_A1A565B0E1CC",
  "this.HTMLText_9FCF2335_8D57_19CE_41D6_87490E40C859",
  "this.Container_9FCF3335_8D57_19CE_41B0_2486A57BB12E",
  "this.Container_9FCEB335_8D57_19CE_41D2_E2FAB2039F45"
 ],
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "horizontalAlign": "left",
 "minHeight": 1,
 "verticalAlign": "bottom",
 "width": "100%",
 "bottom": "0%",
 "contentOpaque": false,
 "minWidth": 1,
 "height": 130,
 "creationPolicy": "inAdvance",
 "scrollBarMargin": 2,
 "gap": 5,
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "visible": false,
 "data": {
  "name": "-Container footer"
 },
 "overflow": "scroll"
},
{
 "class": "Image",
 "maxHeight": 380,
 "maxWidth": 380,
 "id": "Image_99C7A5DB_8D73_187A_41CB_7133B76A2336",
 "left": "20.35%",
 "propagateClick": false,
 "width": "57.333%",
 "borderSize": 0,
 "paddingRight": 0,
 "url": "skin/Image_99C7A5DB_8D73_187A_41CB_7133B76A2336.jpg",
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 1,
 "top": "15.74%",
 "verticalAlign": "middle",
 "minWidth": 1,
 "height": "19.563%",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "scaleMode": "fit_inside",
 "borderRadius": 0,
 "shadow": false,
 "data": {
  "name": "Image14787"
 }
},
{
 "class": "Image",
 "maxHeight": 2,
 "maxWidth": 3000,
 "id": "Image_80D075AB_8D76_EDC1_41DF_1A208B4A85EA",
 "left": "0%",
 "propagateClick": false,
 "right": "0%",
 "borderSize": 0,
 "paddingRight": 0,
 "url": "skin/Image_80D075AB_8D76_EDC1_41DF_1A208B4A85EA.png",
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 1,
 "verticalAlign": "middle",
 "bottom": 53,
 "minWidth": 1,
 "height": 2,
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "scaleMode": "fit_outside",
 "borderRadius": 0,
 "data": {
  "name": "white line"
 },
 "shadow": false
},
{
 "class": "Container",
 "scrollBarWidth": 10,
 "id": "Container_80D045AB_8D76_EDC1_41D8_5B1B88AB15C5",
 "left": "0%",
 "propagateClick": false,
 "width": 1199,
 "scrollBarColor": "#FF0000",
 "layout": "horizontal",
 "children": [
  "this.Button_80D055AB_8D76_EDC1_41E1_2307A72FE9F5",
  "this.Button_80D025AB_8D76_EDC1_41E2_25398B6DF369",
  "this.Button_80D035AB_8D76_EDC1_41CD_EA8143E5B31C"
 ],
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 30,
 "scrollBarVisible": "rollOver",
 "horizontalAlign": "left",
 "verticalAlign": "middle",
 "scrollBarOpacity": 0,
 "minHeight": 1,
 "contentOpaque": false,
 "minWidth": 1,
 "height": 51,
 "bottom": "0%",
 "gap": 3,
 "scrollBarMargin": 2,
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "data": {
  "name": "-button set container"
 },
 "overflow": "scroll",
 "shadow": false
},
{
 "rowCount": 6,
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_1_HS_0_0.png",
   "width": 480,
   "height": 540,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9A2F2E29_8C95_FC29_41DC_7AF638A9DDD5",
 "frameDuration": 41
},
{
 "rowCount": 3,
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_86F8AFDD_8C95_FC69_41D7_A0714797FBE5_1_HS_1_0.png",
   "width": 330,
   "height": 180,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_9A2FEE29_8C95_FC29_418D_6CBEB4265E13",
 "frameDuration": 62
},
{
 "rowCount": 6,
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_1_HS_0_0.png",
   "width": 480,
   "height": 540,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9A2EBE29_8C95_FC29_41C1_6ABEB74D5847",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8612E2B5_8C95_0439_41D7_28ACF40F8EE4_1_HS_1_0.png",
   "width": 480,
   "height": 540,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9A2E8E29_8C95_FC29_41E0_393F8A721547",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_1_HS_0_0.png",
   "width": 480,
   "height": 540,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9A2E6E29_8C95_FC29_41D7_EFB2F4D1E5FD",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_861034B5_8C95_0C39_41CE_711600E16501_1_HS_1_0.png",
   "width": 480,
   "height": 510,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9A2E3E29_8C95_FC29_41CD_35E0C81F2CC9",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_1_HS_0_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9A2D8E29_8C95_FC29_41BF_35ADF5A68ED9",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_8614519F_8C95_04E9_41E0_BD41479F0428_1_HS_1_0.png",
   "width": 480,
   "height": 300,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9A2E5E29_8C95_FC29_41DA_1445A290BFCA",
 "frameDuration": 41
},
{
 "rowCount": 3,
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_0_HS_0_0.png",
   "width": 330,
   "height": 180,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_92800DD2_8C95_3C7B_4170_FACED9E245AC",
 "frameDuration": 62
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_86F99BB0_8C95_0437_41D3_944ADD73F375_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_92806DD2_8C95_3C7B_41DC_E288BA402516",
 "frameDuration": 41
},
{
 "rowCount": 3,
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0_HS_0_0.png",
   "width": 330,
   "height": 180,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_98862182_8D53_18CB_41D4_948E3722692A",
 "frameDuration": 62
},
{
 "rowCount": 3,
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_86E7127F_8C93_0429_41D7_F100BCD60333_0_HS_1_0.png",
   "width": 330,
   "height": 180,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_98868182_8D53_18CB_41A0_968029269732",
 "frameDuration": 62
},
{
 "rowCount": 3,
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_1_HS_0_0.png",
   "width": 330,
   "height": 180,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_9A2F9E29_8C95_FC29_41D7_CFF709ACA0F9",
 "frameDuration": 62
},
{
 "rowCount": 3,
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_86F878D5_8C95_0479_41CD_5CDFE5265804_1_HS_1_0.png",
   "width": 330,
   "height": 180,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_9A286E29_8C95_FC29_41C6_9786975BDFA2",
 "frameDuration": 62
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_1_HS_0_0.png",
   "width": 420,
   "height": 330,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9A2E0E29_8C95_FC29_41D8_4C6DF76A4A9E",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_1_HS_1_0.png",
   "width": 480,
   "height": 540,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9A2ECE29_8C95_FC29_41D5_DA7B79596ECC",
 "frameDuration": 41
},
{
 "rowCount": 3,
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_86F82D7F_8C95_1C29_41D9_C72831BB5D41_1_HS_2_0.png",
   "width": 330,
   "height": 180,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_9A2E9E29_8C95_FC29_41CB_7559A788ECEB",
 "frameDuration": 62
},
{
 "rowCount": 3,
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_86F94777_8C95_0C39_41D6_5FB4FA7DA7C6_0_HS_0_0.png",
   "width": 330,
   "height": 180,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_9887A181_8D53_18C9_41DA_08A8581BAF3F",
 "frameDuration": 62
},
{
 "rowCount": 6,
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_1_HS_0_0.png",
   "width": 480,
   "height": 540,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9A2E2E29_8C95_FC29_41D7_431C77D790EE",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8614AA68_8C95_0457_41C4_75E622B27531_1_HS_1_0.png",
   "width": 480,
   "height": 540,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9A2EFE29_8C95_FC29_41DC_82B7037C34E2",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_1_HS_0_0.png",
   "width": 480,
   "height": 360,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9A238E29_8C95_FC29_41D0_37C37AF6F261",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0_HS_2_0.png",
   "width": 420,
   "height": 330,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_98942173_8D53_1849_41D3_E168DC171049",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8615C86B_8C95_0429_41B9_DA1B156FECBF_0_HS_6_0.png",
   "width": 680,
   "height": 1020,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_B063A06F_9ECF_FC5D_41DD_04192FCFC858",
 "frameDuration": 41
},
{
 "rowCount": 3,
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0_HS_0_0.png",
   "width": 330,
   "height": 180,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_9884E181_8D53_18C9_41BA_205F7D9BB81A",
 "frameDuration": 62
},
{
 "rowCount": 6,
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0_HS_1_0.png",
   "width": 380,
   "height": 570,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9884B181_8D53_18C9_41DC_E0F763D95EDF",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_86F9B4D8_8C95_0C77_41AC_D9AF0F21C0A4_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9887D181_8D53_18C9_41D9_49296248EEE7",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_1_HS_0_0.png",
   "width": 480,
   "height": 540,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9A2F5E29_8C95_FC29_41DE_8A14BB78A284",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_8613AB9E_8C95_04EB_41D5_E989C8D77B6B_1_HS_1_0.png",
   "width": 480,
   "height": 540,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9A2F1E29_8C95_FC29_4126_8C83950CED10",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_1_HS_0_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9A2DFE29_8C95_FC29_41E0_71786DF8C53F",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_86154962_8C95_045B_41A2_0938ED55B232_1_HS_1_0.png",
   "width": 480,
   "height": 510,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9A2DCE29_8C95_FC29_41D7_60BAE9B427BE",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_0_HS_0_0.png",
   "width": 480,
   "height": 510,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_8DE1116B_93D3_785A_41D3_5E38A3EF9159",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_86148099_8C95_04E9_41DF_E6EB2C088EAE_1_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9A2D1E29_8C95_FC29_4183_05AF386C7D2F",
 "frameDuration": 41
},
{
 "rowCount": 3,
 "frameCount": 9,
 "levels": [
  {
   "url": "media/panorama_86F81687_8C95_0CD9_41D3_8D72FD5B4D63_1_HS_0_0.png",
   "width": 330,
   "height": 180,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 3,
 "id": "AnimatedImageResource_9A2F6E29_8C95_FC29_41DD_1D9E8349B4F6",
 "frameDuration": 62
},
{
 "rowCount": 6,
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_1_HS_0_0.png",
   "width": 480,
   "height": 540,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9A281E29_8C95_FC29_41B4_8590EBC51D10",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_1_HS_1_0.png",
   "width": 480,
   "height": 330,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9A28CE39_8C95_FC29_41D4_AE0F913B35B6",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_86F8722B_8C95_0429_41AE_DCCBDF38B499_1_HS_2_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_9A288E39_8C95_FC29_41A2_D694176A5023",
 "frameDuration": 41
},
{
 "class": "Container",
 "scrollBarWidth": 10,
 "id": "Container_9FC91333_8D57_19CA_41D4_1A521AA2383E",
 "left": "-1125.76%",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": true,
 "width": 30,
 "scrollBarColor": "#000000",
 "layout": "absolute",
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "minWidth": 1,
 "verticalAlign": "top",
 "backgroundColor": [
  "#0089C8"
 ],
 "horizontalAlign": "left",
 "height": "100%",
 "top": "0%",
 "gap": 10,
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0.7,
 "borderRadius": 0,
 "visible": false,
 "data": {
  "name": "Container blue"
 },
 "overflow": "scroll",
 "shadow": false
},
{
 "shadowSpread": 1,
 "class": "Button",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "textDecoration": "none",
 "id": "Button_9FC86333_8D57_19CA_41DF_515BA0A96BFA",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "data": {
  "name": "Button 1 - Reception"
 },
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "fontColor": "#FFFFFF",
 "iconBeforeLabel": true,
 "borderSize": 0,
 "paddingRight": 0,
 "layout": "horizontal",
 "iconHeight": 32,
 "paddingLeft": 10,
 "backgroundColorDirection": "vertical",
 "minHeight": 1,
 "horizontalAlign": "left",
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "minWidth": 1,
 "mode": "toggle",
 "fontSize": 18,
 "label": "Loja 01",
 "height": 50,
 "shadowBlurRadius": 6,
 "gap": 5,
 "click": "this.setComponentVisibility(this.Container_9FC82334_8D57_19CE_41E1_345271A21403, false, 0, this.effect_406C8EDB_5426_70A1_41AB_C419AD03A638, 'hideEffect', false); this.setComponentVisibility(this.Container_9FCEA335_8D57_19CE_41DA_FEFA3E81D99B, false, 0, this.effect_406C8EDB_5426_70A1_41AB_C419AD03A638, 'hideEffect', false); this.mainPlayList.set('selectedIndex', 0)",
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "paddingBottom": 0,
 "backgroundOpacity": 0.2,
 "borderRadius": 0,
 "shadow": false,
 "rollOverBackgroundOpacity": 0.8,
 "iconWidth": 32,
 "cursor": "hand",
 "pressedBackgroundOpacity": 0.2,
 "width": "100%",
 "fontWeight": "normal"
},
{
 "class": "Container",
 "scrollBarWidth": 10,
 "id": "Container_9FCF8333_8D57_19CA_41D7_08ACA3624D4A",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "scrollBarColor": "#000000",
 "layout": "absolute",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "verticalAlign": "top",
 "width": "100%",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minWidth": 1,
 "horizontalAlign": "left",
 "height": 1,
 "gap": 10,
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0.3,
 "borderRadius": 0,
 "shadow": false,
 "visible": false,
 "data": {
  "name": "line"
 },
 "overflow": "scroll"
},
{
 "shadowSpread": 1,
 "class": "Button",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "textDecoration": "none",
 "id": "Button_9FCF9333_8D57_19CA_41DE_E89CC9C0367F",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "data": {
  "name": "Button 2 - Rooms"
 },
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "fontColor": "#FFFFFF",
 "iconBeforeLabel": true,
 "borderSize": 0,
 "paddingRight": 0,
 "layout": "horizontal",
 "iconHeight": 32,
 "paddingLeft": 10,
 "backgroundColorDirection": "vertical",
 "minHeight": 1,
 "horizontalAlign": "left",
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "minWidth": 1,
 "mode": "toggle",
 "fontSize": 18,
 "label": "Loja 02",
 "height": 50,
 "shadowBlurRadius": 6,
 "gap": 23,
 "click": "this.setComponentVisibility(this.Container_9FC82334_8D57_19CE_41E1_345271A21403, false, 0, this.effect_4016129C_5467_90A7_41B5_2C5E462A0C83, 'hideEffect', false); this.setComponentVisibility(this.Container_9FCEA335_8D57_19CE_41DA_FEFA3E81D99B, false, 0, this.effect_4016129C_5467_90A7_41B5_2C5E462A0C83, 'hideEffect', false); this.mainPlayList.set('selectedIndex', 14)",
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColor": [
  "#5CA1DE"
 ],
 "paddingBottom": 0,
 "backgroundOpacity": 0.2,
 "borderRadius": 0,
 "shadow": false,
 "rollOverBackgroundOpacity": 0.8,
 "iconWidth": 32,
 "cursor": "hand",
 "pressedBackgroundOpacity": 0.2,
 "width": "100%",
 "fontWeight": "normal"
},
{
 "class": "Container",
 "scrollBarWidth": 7,
 "id": "Container_9FC82334_8D57_19CE_41E1_345271A21403",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": true,
 "scrollBarColor": "#000000",
 "layout": "vertical",
 "scrollBarOpacity": 0,
 "children": [
  "this.Container_9FC83334_8D57_19CE_41D9_984D60DD6F6A",
  "this.Container_9FC80334_8D57_19CE_41BA_0F76AEB2476D",
  "this.Button_9FCFE334_8D57_19CE_41D8_0DF478C72B69",
  "this.Button_9FCFF334_8D57_19CE_41CE_F20A318F98E1",
  "this.Button_9FCFC334_8D57_19CE_41BA_8AA8C489CAF0",
  "this.Button_9FCFD334_8D57_19CE_41AD_226BCC55C6D1",
  "this.Button_9FCFB334_8D57_19CE_41C5_6A7813AA477B",
  "this.Button_9FCF8334_8D57_19CE_41D5_67F42BF611BB",
  "this.Button_9FCF9334_8D57_19CE_41B6_45CC9F42B49C",
  "this.Button_9FCF6334_8D57_19CE_41E1_9FE84BBCAFCF"
 ],
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "verticalAlign": "middle",
 "width": "100%",
 "contentOpaque": false,
 "backgroundColor": [
  "#000000"
 ],
 "minWidth": 1,
 "horizontalAlign": "left",
 "scrollBarMargin": 10,
 "height": 200,
 "gap": 0,
 "creationPolicy": "inAdvance",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0.3,
 "borderRadius": 0,
 "shadow": false,
 "visible": false,
 "data": {
  "name": "-Level 3-1"
 },
 "overflow": "scroll"
},
{
 "class": "Container",
 "scrollBarWidth": 10,
 "id": "Container_9FCF2334_8D57_19CE_41A8_0D253F6B8256",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "scrollBarColor": "#000000",
 "layout": "absolute",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "verticalAlign": "top",
 "width": "100%",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minWidth": 1,
 "horizontalAlign": "left",
 "height": 1,
 "gap": 10,
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0.3,
 "borderRadius": 0,
 "shadow": false,
 "visible": false,
 "data": {
  "name": "line"
 },
 "overflow": "scroll"
},
{
 "class": "Container",
 "scrollBarWidth": 10,
 "id": "Container_9FCED335_8D57_19CE_41E1_0E38E54933D9",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "scrollBarColor": "#000000",
 "layout": "absolute",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "verticalAlign": "top",
 "width": "100%",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minWidth": 1,
 "horizontalAlign": "left",
 "height": 1,
 "gap": 10,
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0.3,
 "borderRadius": 0,
 "shadow": false,
 "visible": false,
 "data": {
  "name": "line"
 },
 "overflow": "scroll"
},
{
 "class": "Container",
 "scrollBarWidth": 7,
 "id": "Container_9FCEA335_8D57_19CE_41DA_FEFA3E81D99B",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": true,
 "scrollBarColor": "#000000",
 "layout": "vertical",
 "scrollBarOpacity": 0,
 "children": [
  "this.Container_9FCEB335_8D57_19CE_41C8_3682914CB0F2",
  "this.Container_9FCE8335_8D57_19CE_41A9_902DDC6613AE",
  "this.Button_9FCE7335_8D57_19CE_41DB_6E52B44E5324",
  "this.Button_9FCE4335_8D57_19CE_41CD_6F9FA69F8284",
  "this.Button_9FCE5335_8D57_19CE_41D8_C606D334C440",
  "this.Button_9FCE2335_8D57_19CE_4195_AF191AA25766",
  "this.Button_9FCE3335_8D57_19CE_41DF_E99AC2A9FB1A",
  "this.Button_9FCE0335_8D57_19CE_419F_7B295040DFA6",
  "this.Button_9FCE1335_8D57_19CE_41BE_DBE818314FF0",
  "this.Button_9FCF9335_8D57_19CE_4177_4D879C1AC6C1"
 ],
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "verticalAlign": "middle",
 "width": "100%",
 "contentOpaque": false,
 "backgroundColor": [
  "#000000"
 ],
 "minWidth": 1,
 "horizontalAlign": "left",
 "scrollBarMargin": 10,
 "height": 200,
 "gap": 0,
 "creationPolicy": "inAdvance",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0.3,
 "borderRadius": 0,
 "shadow": false,
 "visible": false,
 "data": {
  "name": "-Level 6-1"
 },
 "overflow": "scroll"
},
{
 "class": "Container",
 "scrollBarWidth": 10,
 "id": "Container_9FCF4335_8D57_19CE_41D6_A1A565B0E1CC",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": true,
 "width": 40,
 "scrollBarColor": "#000000",
 "layout": "horizontal",
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "backgroundColor": [
  "#5CA1DE"
 ],
 "minWidth": 1,
 "horizontalAlign": "left",
 "height": 2,
 "gap": 10,
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 1,
 "borderRadius": 0,
 "visible": false,
 "data": {
  "name": "blue line"
 },
 "overflow": "visible",
 "shadow": false
},
{
 "class": "HTMLText",
 "id": "HTMLText_9FCF2335_8D57_19CE_41D6_87490E40C859",
 "propagateClick": true,
 "scrollBarColor": "#000000",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "width": "100%",
 "scrollBarMargin": 2,
 "minWidth": 1,
 "height": 78,
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "visible": false,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#ffffff;font-size:14px;font-family:'Oswald Regular';\"><I>Company Name</I></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#ffffff;font-size:14px;font-family:'Oswald Regular';\"><I>www.loremipsum.com</I></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#ffffff;font-size:14px;font-family:'Oswald Regular';\"><I>info@loremipsum.com</I></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0px;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#ffffff;font-size:14px;font-family:'Oswald Regular';\"><I>Tlf.: +11 111 111 111</I></SPAN></SPAN></DIV></div>",
 "data": {
  "name": "HTMLText47602"
 },
 "scrollBarWidth": 10
},
{
 "class": "Container",
 "children": [
  "this.IconButton_9FCEC335_8D57_19CE_41C0_892AAB4EF1AF",
  "this.Image_97156052_8DF1_184B_41D9_49B8D4A9B09B"
 ],
 "id": "Container_9FCF3335_8D57_19CE_41B0_2486A57BB12E",
 "propagateClick": false,
 "scrollBarColor": "#000000",
 "layout": "horizontal",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "horizontalAlign": "left",
 "verticalAlign": "bottom",
 "width": "100%",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "minWidth": 1,
 "height": 56,
 "gap": 7,
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "visible": false,
 "data": {
  "name": "-Container Icons 1"
 },
 "overflow": "visible",
 "scrollBarWidth": 10
},
{
 "class": "Container",
 "children": [
  "this.IconButton_9FCE6335_8D57_19CE_41D6_279A9F446090",
  "this.IconButton_9FCE7335_8D57_19CE_41CA_297A6B74890D"
 ],
 "id": "Container_9FCEB335_8D57_19CE_41D2_E2FAB2039F45",
 "propagateClick": false,
 "scrollBarColor": "#000000",
 "layout": "horizontal",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "horizontalAlign": "left",
 "verticalAlign": "top",
 "width": "100%",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "minWidth": 1,
 "height": 44,
 "gap": 7,
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "data": {
  "name": "-Container Icons 2"
 },
 "overflow": "visible",
 "scrollBarWidth": 10
},
{
 "shadowSpread": 1,
 "class": "Button",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "textDecoration": "none",
 "id": "Button_80D055AB_8D76_EDC1_41E1_2307A72FE9F5",
 "rollOverBackgroundColor": [
  "#BBD149"
 ],
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "width": 110,
 "data": {
  "name": "Button house info"
 },
 "shadowColor": "#000000",
 "fontFamily": "Yu Gothic",
 "fontColor": "#FFFFFF",
 "borderSize": 0,
 "paddingRight": 0,
 "layout": "horizontal",
 "iconHeight": 0,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 1,
 "backgroundColorDirection": "vertical",
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "pressedBackgroundColorRatios": [
  0
 ],
 "minWidth": 1,
 "mode": "push",
 "height": 40,
 "fontSize": 12,
 "label": "INSTAGRAM",
 "backgroundColor": [
  "#000000"
 ],
 "shadowBlurRadius": 15,
 "gap": 5,
 "iconBeforeLabel": true,
 "click": "this.openLink('http://https://www.instagram.com/bateriasok/', '_blank')",
 "fontStyle": "normal",
 "paddingTop": 0,
 "pressedBackgroundColor": [
  "#BBD149"
 ],
 "rollOverShadow": false,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "rollOverBackgroundOpacity": 0.8,
 "iconWidth": 0,
 "shadow": false,
 "cursor": "hand",
 "pressedBackgroundOpacity": 1,
 "fontWeight": "bold"
},
{
 "shadowSpread": 1,
 "class": "Button",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "textDecoration": "none",
 "id": "Button_80D025AB_8D76_EDC1_41E2_25398B6DF369",
 "rollOverBackgroundColor": [
  "#BBD149"
 ],
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "width": 130,
 "data": {
  "name": "Button panorama list"
 },
 "shadowColor": "#000000",
 "fontFamily": "Yu Gothic",
 "fontColor": "#FFFFFF",
 "borderSize": 0,
 "paddingRight": 0,
 "layout": "horizontal",
 "iconHeight": 32,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 1,
 "backgroundColorDirection": "vertical",
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "pressedBackgroundColorRatios": [
  0
 ],
 "minWidth": 1,
 "mode": "push",
 "height": 40,
 "fontSize": 12,
 "label": "LOCALIZA\u00c7\u00c3O",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "shadowBlurRadius": 15,
 "gap": 5,
 "iconBeforeLabel": true,
 "click": "this.openLink('http://https://www.google.com/search?q=baterias+ok&oq=BATERIAS+OK&aqs=chrome.0.69i59j69i60l3.10242j0j4&sourceid=chrome&ie=UTF-8', '_blank')",
 "fontStyle": "normal",
 "paddingTop": 0,
 "pressedBackgroundColor": [
  "#BBD149"
 ],
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "rollOverBackgroundOpacity": 0.8,
 "iconWidth": 32,
 "shadow": false,
 "cursor": "hand",
 "pressedBackgroundOpacity": 1,
 "fontWeight": "bold"
},
{
 "shadowSpread": 1,
 "class": "Button",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "textDecoration": "none",
 "id": "Button_80D035AB_8D76_EDC1_41CD_EA8143E5B31C",
 "rollOverBackgroundColor": [
  "#BBD149"
 ],
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "width": 90,
 "data": {
  "name": "Button location"
 },
 "shadowColor": "#000000",
 "fontFamily": "Yu Gothic",
 "fontColor": "#FFFFFF",
 "borderSize": 0,
 "paddingRight": 0,
 "layout": "horizontal",
 "iconHeight": 32,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 1,
 "backgroundColorDirection": "vertical",
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "pressedBackgroundColorRatios": [
  0
 ],
 "minWidth": 1,
 "mode": "push",
 "height": 40,
 "fontSize": 12,
 "label": "WHATSAPP",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "shadowBlurRadius": 15,
 "gap": 5,
 "iconBeforeLabel": true,
 "click": "this.openLink('http://https://api.whatsapp.com/send?phone=5577988127060&text=Vi%20esse%20anuncio%20no%20Instagram,%20gostaria%20de%20informa%C3%A7%C3%B5es.', '_blank')",
 "fontStyle": "normal",
 "paddingTop": 0,
 "pressedBackgroundColor": [
  "#BBD149"
 ],
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "rollOverBackgroundOpacity": 0.8,
 "iconWidth": 32,
 "shadow": false,
 "cursor": "hand",
 "pressedBackgroundOpacity": 1,
 "fontWeight": "bold"
},
{
 "class": "Container",
 "scrollBarWidth": 10,
 "id": "Container_9FC83334_8D57_19CE_41D9_984D60DD6F6A",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "scrollBarColor": "#000000",
 "layout": "absolute",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "verticalAlign": "top",
 "width": "100%",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minWidth": 1,
 "horizontalAlign": "left",
 "height": 1,
 "gap": 10,
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0.5,
 "borderRadius": 0,
 "shadow": false,
 "data": {
  "name": "line"
 },
 "overflow": "scroll"
},
{
 "class": "Container",
 "id": "Container_9FC80334_8D57_19CE_41BA_0F76AEB2476D",
 "propagateClick": true,
 "scrollBarColor": "#000000",
 "layout": "absolute",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "horizontalAlign": "left",
 "verticalAlign": "top",
 "width": "100%",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "minWidth": 1,
 "height": 8,
 "gap": 10,
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "data": {
  "name": "line separator"
 },
 "overflow": "scroll",
 "scrollBarWidth": 10
},
{
 "shadowSpread": 1,
 "class": "Button",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "textDecoration": "none",
 "id": "Button_9FCFE334_8D57_19CE_41D8_0DF478C72B69",
 "pressedBackgroundOpacity": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "data": {
  "name": "Button text 1"
 },
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "fontColor": "#FFFFFF",
 "iconBeforeLabel": true,
 "borderSize": 0,
 "paddingRight": 0,
 "layout": "horizontal",
 "iconHeight": 32,
 "paddingLeft": 20,
 "horizontalAlign": "left",
 "minHeight": 1,
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "backgroundColorDirection": "vertical",
 "minWidth": 1,
 "mode": "push",
 "height": 36,
 "fontSize": 18,
 "label": "Lorem Ipsum",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "shadowBlurRadius": 15,
 "gap": 5,
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColor": [
  "#000000"
 ],
 "rollOverShadow": false,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "rollOverShadowBlurRadius": 18,
 "rollOverBackgroundOpacity": 0.3,
 "iconWidth": 32,
 "cursor": "hand",
 "width": "100%",
 "fontWeight": "normal"
},
{
 "shadowSpread": 1,
 "class": "Button",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "textDecoration": "none",
 "id": "Button_9FCFF334_8D57_19CE_41CE_F20A318F98E1",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "data": {
  "name": "Button text 2"
 },
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "fontColor": "#FFFFFF",
 "iconBeforeLabel": true,
 "borderSize": 0,
 "paddingRight": 0,
 "layout": "horizontal",
 "iconHeight": 32,
 "paddingLeft": 20,
 "horizontalAlign": "left",
 "minHeight": 1,
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "backgroundColorDirection": "vertical",
 "minWidth": 1,
 "mode": "push",
 "height": 36,
 "fontSize": 18,
 "label": "Lorem Ipsum",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "shadowBlurRadius": 6,
 "gap": 23,
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColor": [
  "#000000"
 ],
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "rollOverBackgroundOpacity": 0.3,
 "iconWidth": 32,
 "cursor": "hand",
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "fontWeight": "normal"
},
{
 "shadowSpread": 1,
 "class": "Button",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "textDecoration": "none",
 "id": "Button_9FCFC334_8D57_19CE_41BA_8AA8C489CAF0",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "data": {
  "name": "Button text 3"
 },
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "fontColor": "#FFFFFF",
 "iconBeforeLabel": true,
 "borderSize": 0,
 "paddingRight": 0,
 "layout": "horizontal",
 "iconHeight": 32,
 "paddingLeft": 20,
 "horizontalAlign": "left",
 "minHeight": 1,
 "pressedLabel": "Lorem Ipsum",
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "backgroundColorDirection": "vertical",
 "minWidth": 1,
 "mode": "push",
 "height": 36,
 "fontSize": 18,
 "label": "Lorem Ipsum",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "shadowBlurRadius": 6,
 "gap": 5,
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColor": [
  "#000000"
 ],
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "rollOverBackgroundOpacity": 0.3,
 "iconWidth": 32,
 "cursor": "hand",
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "fontWeight": "normal"
},
{
 "shadowSpread": 1,
 "class": "Button",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "textDecoration": "none",
 "id": "Button_9FCFD334_8D57_19CE_41AD_226BCC55C6D1",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "data": {
  "name": "Button text 4"
 },
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "fontColor": "#FFFFFF",
 "iconBeforeLabel": true,
 "borderSize": 0,
 "paddingRight": 0,
 "layout": "horizontal",
 "iconHeight": 32,
 "paddingLeft": 20,
 "horizontalAlign": "left",
 "minHeight": 1,
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "backgroundColorDirection": "vertical",
 "minWidth": 1,
 "mode": "push",
 "height": 36,
 "fontSize": 18,
 "label": "Lorem Ipsum",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "shadowBlurRadius": 6,
 "gap": 5,
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColor": [
  "#000000"
 ],
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "rollOverBackgroundOpacity": 0.3,
 "iconWidth": 32,
 "cursor": "hand",
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "fontWeight": "normal"
},
{
 "shadowSpread": 1,
 "class": "Button",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "textDecoration": "none",
 "id": "Button_9FCFB334_8D57_19CE_41C5_6A7813AA477B",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "data": {
  "name": "Button text 5"
 },
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "fontColor": "#FFFFFF",
 "iconBeforeLabel": true,
 "borderSize": 0,
 "paddingRight": 0,
 "layout": "horizontal",
 "iconHeight": 32,
 "paddingLeft": 20,
 "horizontalAlign": "left",
 "minHeight": 1,
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "backgroundColorDirection": "vertical",
 "minWidth": 1,
 "mode": "push",
 "height": 36,
 "fontSize": 18,
 "label": "Lorem Ipsum",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "shadowBlurRadius": 6,
 "gap": 5,
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColor": [
  "#000000"
 ],
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "rollOverBackgroundOpacity": 0.3,
 "iconWidth": 32,
 "cursor": "hand",
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "fontWeight": "normal"
},
{
 "shadowSpread": 1,
 "class": "Button",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "textDecoration": "none",
 "id": "Button_9FCF8334_8D57_19CE_41D5_67F42BF611BB",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "data": {
  "name": "Button text 6"
 },
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "fontColor": "#FFFFFF",
 "iconBeforeLabel": true,
 "borderSize": 0,
 "paddingRight": 0,
 "layout": "horizontal",
 "iconHeight": 32,
 "paddingLeft": 20,
 "horizontalAlign": "left",
 "minHeight": 1,
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "backgroundColorDirection": "vertical",
 "minWidth": 1,
 "mode": "push",
 "height": 36,
 "fontSize": 18,
 "label": "Lorem ipsum",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "shadowBlurRadius": 6,
 "gap": 5,
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColor": [
  "#000000"
 ],
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "rollOverBackgroundOpacity": 0.3,
 "iconWidth": 32,
 "cursor": "hand",
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "fontWeight": "normal"
},
{
 "shadowSpread": 1,
 "class": "Button",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "textDecoration": "none",
 "id": "Button_9FCF9334_8D57_19CE_41B6_45CC9F42B49C",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "data": {
  "name": "Button text 7"
 },
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "fontColor": "#FFFFFF",
 "iconBeforeLabel": true,
 "borderSize": 0,
 "paddingRight": 0,
 "layout": "horizontal",
 "iconHeight": 32,
 "paddingLeft": 20,
 "horizontalAlign": "left",
 "minHeight": 1,
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "backgroundColorDirection": "vertical",
 "minWidth": 1,
 "mode": "push",
 "height": 36,
 "fontSize": 18,
 "label": "Lorem Ipsum",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "shadowBlurRadius": 6,
 "gap": 5,
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColor": [
  "#000000"
 ],
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "rollOverBackgroundOpacity": 0.3,
 "iconWidth": 32,
 "cursor": "hand",
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "fontWeight": "normal"
},
{
 "shadowSpread": 1,
 "class": "Button",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "textDecoration": "none",
 "id": "Button_9FCF6334_8D57_19CE_41E1_9FE84BBCAFCF",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "data": {
  "name": "Button text 8"
 },
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "fontColor": "#FFFFFF",
 "iconBeforeLabel": true,
 "borderSize": 0,
 "paddingRight": 0,
 "layout": "horizontal",
 "iconHeight": 32,
 "paddingLeft": 20,
 "horizontalAlign": "left",
 "minHeight": 1,
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "backgroundColorDirection": "vertical",
 "minWidth": 1,
 "mode": "push",
 "height": 36,
 "fontSize": 18,
 "label": "Lorem Ipsum",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "shadowBlurRadius": 6,
 "gap": 5,
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColor": [
  "#000000"
 ],
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "rollOverBackgroundOpacity": 0.3,
 "iconWidth": 32,
 "cursor": "hand",
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "fontWeight": "normal"
},
{
 "class": "Container",
 "scrollBarWidth": 10,
 "id": "Container_9FCEB335_8D57_19CE_41C8_3682914CB0F2",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "scrollBarColor": "#000000",
 "layout": "absolute",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "backgroundColorDirection": "vertical",
 "minHeight": 1,
 "scrollBarVisible": "rollOver",
 "verticalAlign": "top",
 "width": "100%",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minWidth": 1,
 "horizontalAlign": "left",
 "height": 1,
 "gap": 10,
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0.5,
 "borderRadius": 0,
 "shadow": false,
 "data": {
  "name": "line"
 },
 "overflow": "scroll"
},
{
 "class": "Container",
 "id": "Container_9FCE8335_8D57_19CE_41A9_902DDC6613AE",
 "propagateClick": true,
 "scrollBarColor": "#000000",
 "layout": "absolute",
 "scrollBarOpacity": 0.5,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "scrollBarVisible": "rollOver",
 "minHeight": 1,
 "horizontalAlign": "left",
 "verticalAlign": "top",
 "width": "100%",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "minWidth": 1,
 "height": 8,
 "gap": 10,
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "data": {
  "name": "line separator"
 },
 "overflow": "scroll",
 "scrollBarWidth": 10
},
{
 "shadowSpread": 1,
 "class": "Button",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "textDecoration": "none",
 "id": "Button_9FCE7335_8D57_19CE_41DB_6E52B44E5324",
 "pressedBackgroundOpacity": 1,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "data": {
  "name": "Button text 1"
 },
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "fontColor": "#FFFFFF",
 "iconBeforeLabel": true,
 "borderSize": 0,
 "paddingRight": 0,
 "layout": "horizontal",
 "iconHeight": 32,
 "paddingLeft": 20,
 "horizontalAlign": "left",
 "minHeight": 1,
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "backgroundColorDirection": "vertical",
 "minWidth": 1,
 "mode": "push",
 "height": 36,
 "fontSize": 18,
 "label": "Lorem Ipsum",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "shadowBlurRadius": 15,
 "gap": 5,
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColor": [
  "#000000"
 ],
 "rollOverShadow": false,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "rollOverShadowBlurRadius": 18,
 "rollOverBackgroundOpacity": 0.3,
 "iconWidth": 32,
 "cursor": "hand",
 "width": "100%",
 "fontWeight": "normal"
},
{
 "shadowSpread": 1,
 "class": "Button",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "textDecoration": "none",
 "id": "Button_9FCE4335_8D57_19CE_41CD_6F9FA69F8284",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "data": {
  "name": "Button text 2"
 },
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "fontColor": "#FFFFFF",
 "iconBeforeLabel": true,
 "borderSize": 0,
 "paddingRight": 0,
 "layout": "horizontal",
 "iconHeight": 32,
 "paddingLeft": 20,
 "horizontalAlign": "left",
 "minHeight": 1,
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "backgroundColorDirection": "vertical",
 "minWidth": 1,
 "mode": "push",
 "height": 36,
 "fontSize": 18,
 "label": "Lorem Ipsum",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "shadowBlurRadius": 6,
 "gap": 23,
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColor": [
  "#000000"
 ],
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "rollOverBackgroundOpacity": 0.3,
 "iconWidth": 32,
 "cursor": "hand",
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "fontWeight": "normal"
},
{
 "shadowSpread": 1,
 "class": "Button",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "textDecoration": "none",
 "id": "Button_9FCE5335_8D57_19CE_41D8_C606D334C440",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "data": {
  "name": "Button text 3"
 },
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "fontColor": "#FFFFFF",
 "iconBeforeLabel": true,
 "borderSize": 0,
 "paddingRight": 0,
 "layout": "horizontal",
 "iconHeight": 32,
 "paddingLeft": 20,
 "horizontalAlign": "left",
 "minHeight": 1,
 "pressedLabel": "Lorem Ipsum",
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "backgroundColorDirection": "vertical",
 "minWidth": 1,
 "mode": "push",
 "height": 36,
 "fontSize": 18,
 "label": "Lorem Ipsum",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "shadowBlurRadius": 6,
 "gap": 5,
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColor": [
  "#000000"
 ],
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "rollOverBackgroundOpacity": 0.3,
 "iconWidth": 32,
 "cursor": "hand",
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "fontWeight": "normal"
},
{
 "shadowSpread": 1,
 "class": "Button",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "textDecoration": "none",
 "id": "Button_9FCE2335_8D57_19CE_4195_AF191AA25766",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "data": {
  "name": "Button text 4"
 },
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "fontColor": "#FFFFFF",
 "iconBeforeLabel": true,
 "borderSize": 0,
 "paddingRight": 0,
 "layout": "horizontal",
 "iconHeight": 32,
 "paddingLeft": 20,
 "horizontalAlign": "left",
 "minHeight": 1,
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "backgroundColorDirection": "vertical",
 "minWidth": 1,
 "mode": "push",
 "height": 36,
 "fontSize": 18,
 "label": "Lorem Ipsum",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "shadowBlurRadius": 6,
 "gap": 5,
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColor": [
  "#000000"
 ],
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "rollOverBackgroundOpacity": 0.3,
 "iconWidth": 32,
 "cursor": "hand",
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "fontWeight": "normal"
},
{
 "shadowSpread": 1,
 "class": "Button",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "textDecoration": "none",
 "id": "Button_9FCE3335_8D57_19CE_41DF_E99AC2A9FB1A",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "data": {
  "name": "Button text 5"
 },
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "fontColor": "#FFFFFF",
 "iconBeforeLabel": true,
 "borderSize": 0,
 "paddingRight": 0,
 "layout": "horizontal",
 "iconHeight": 32,
 "paddingLeft": 20,
 "horizontalAlign": "left",
 "minHeight": 1,
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "backgroundColorDirection": "vertical",
 "minWidth": 1,
 "mode": "push",
 "height": 36,
 "fontSize": 18,
 "label": "Lorem Ipsum",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "shadowBlurRadius": 6,
 "gap": 5,
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColor": [
  "#000000"
 ],
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "rollOverBackgroundOpacity": 0.3,
 "iconWidth": 32,
 "cursor": "hand",
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "fontWeight": "normal"
},
{
 "shadowSpread": 1,
 "class": "Button",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "textDecoration": "none",
 "id": "Button_9FCE0335_8D57_19CE_419F_7B295040DFA6",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "data": {
  "name": "Button text 6"
 },
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "fontColor": "#FFFFFF",
 "iconBeforeLabel": true,
 "borderSize": 0,
 "paddingRight": 0,
 "layout": "horizontal",
 "iconHeight": 32,
 "paddingLeft": 20,
 "horizontalAlign": "left",
 "minHeight": 1,
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "backgroundColorDirection": "vertical",
 "minWidth": 1,
 "mode": "push",
 "height": 36,
 "fontSize": 18,
 "label": "Lorem ipsum",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "shadowBlurRadius": 6,
 "gap": 5,
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColor": [
  "#000000"
 ],
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "rollOverBackgroundOpacity": 0.3,
 "iconWidth": 32,
 "cursor": "hand",
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "fontWeight": "normal"
},
{
 "shadowSpread": 1,
 "class": "Button",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "textDecoration": "none",
 "id": "Button_9FCE1335_8D57_19CE_41BE_DBE818314FF0",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "data": {
  "name": "Button text 7"
 },
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "fontColor": "#FFFFFF",
 "iconBeforeLabel": true,
 "borderSize": 0,
 "paddingRight": 0,
 "layout": "horizontal",
 "iconHeight": 32,
 "paddingLeft": 20,
 "horizontalAlign": "left",
 "minHeight": 1,
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "backgroundColorDirection": "vertical",
 "minWidth": 1,
 "mode": "push",
 "height": 36,
 "fontSize": 18,
 "label": "Lorem Ipsum",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "shadowBlurRadius": 6,
 "gap": 5,
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColor": [
  "#000000"
 ],
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "rollOverBackgroundOpacity": 0.3,
 "iconWidth": 32,
 "cursor": "hand",
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "fontWeight": "normal"
},
{
 "shadowSpread": 1,
 "class": "Button",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "textDecoration": "none",
 "id": "Button_9FCF9335_8D57_19CE_4177_4D879C1AC6C1",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "data": {
  "name": "Button text 8"
 },
 "shadowColor": "#000000",
 "fontFamily": "Oswald",
 "fontColor": "#FFFFFF",
 "iconBeforeLabel": true,
 "borderSize": 0,
 "paddingRight": 0,
 "layout": "horizontal",
 "iconHeight": 32,
 "paddingLeft": 20,
 "horizontalAlign": "left",
 "minHeight": 1,
 "verticalAlign": "middle",
 "borderColor": "#000000",
 "backgroundColorDirection": "vertical",
 "minWidth": 1,
 "mode": "push",
 "height": 36,
 "fontSize": 18,
 "label": "Lorem Ipsum",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "shadowBlurRadius": 6,
 "gap": 5,
 "fontStyle": "italic",
 "paddingTop": 0,
 "rollOverBackgroundColor": [
  "#000000"
 ],
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "shadow": false,
 "rollOverBackgroundOpacity": 0.3,
 "iconWidth": 32,
 "cursor": "hand",
 "pressedBackgroundOpacity": 1,
 "width": "100%",
 "fontWeight": "normal"
},
{
 "transparencyActive": false,
 "class": "IconButton",
 "maxHeight": 101,
 "maxWidth": 101,
 "id": "IconButton_9FCEC335_8D57_19CE_41C0_892AAB4EF1AF",
 "propagateClick": false,
 "width": 44,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 1,
 "verticalAlign": "middle",
 "iconURL": "skin/IconButton_9FCEC335_8D57_19CE_41C0_892AAB4EF1AF.png",
 "minWidth": 1,
 "mode": "push",
 "height": 44,
 "click": "this.openLink('http://https://www.google.com.br/maps/place/Baterias+Ok/@-14.8677522,-40.8511,15z/data=!4m5!3m4!1s0x0:0xe02dac2a5f53089!8m2!3d-14.8677522!4d-40.8511', '_blank')",
 "rollOverIconURL": "skin/IconButton_9FCEC335_8D57_19CE_41C0_892AAB4EF1AF_rollover.png",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "visible": false,
 "data": {
  "name": "IconButton Location"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "class": "Image",
 "maxHeight": 100,
 "maxWidth": 100,
 "id": "Image_97156052_8DF1_184B_41D9_49B8D4A9B09B",
 "propagateClick": false,
 "width": "27.273%",
 "borderSize": 0,
 "paddingRight": 0,
 "url": "skin/Image_97156052_8DF1_184B_41D9_49B8D4A9B09B.png",
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 60,
 "verticalAlign": "middle",
 "minWidth": 60,
 "height": "100%",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "scaleMode": "fit_inside",
 "borderRadius": 0,
 "shadow": false,
 "data": {
  "name": "Image22397"
 }
},
{
 "transparencyActive": false,
 "class": "IconButton",
 "maxHeight": 101,
 "maxWidth": 101,
 "id": "IconButton_9FCE6335_8D57_19CE_41D6_279A9F446090",
 "propagateClick": false,
 "width": 44,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 1,
 "verticalAlign": "middle",
 "iconURL": "skin/IconButton_9FCE6335_8D57_19CE_41D6_279A9F446090.png",
 "minWidth": 1,
 "mode": "push",
 "height": 44,
 "click": "this.openLink('files/file_9A45FD41_8D71_2846_417F_4B8530651E5B.mp4', '_blank')",
 "rollOverIconURL": "skin/IconButton_9FCE6335_8D57_19CE_41D6_279A9F446090_rollover.png",
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "data": {
  "name": "IconButton Video"
 },
 "shadow": false,
 "cursor": "hand"
},
{
 "transparencyActive": false,
 "class": "IconButton",
 "maxHeight": 101,
 "maxWidth": 101,
 "id": "IconButton_9FCE7335_8D57_19CE_41CA_297A6B74890D",
 "propagateClick": false,
 "width": 50,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "horizontalAlign": "center",
 "minHeight": 1,
 "verticalAlign": "middle",
 "iconURL": "skin/IconButton_9FCE7335_8D57_19CE_41CA_297A6B74890D.png",
 "pressedRollOverIconURL": "skin/IconButton_9FCE7335_8D57_19CE_41CA_297A6B74890D_pressed_rollover.png",
 "minWidth": 1,
 "mode": "push",
 "height": 50,
 "paddingTop": 0,
 "paddingBottom": 0,
 "backgroundOpacity": 0,
 "borderRadius": 0,
 "pressedIconURL": "skin/IconButton_9FCE7335_8D57_19CE_41CA_297A6B74890D_pressed.png",
 "visible": false,
 "data": {
  "name": "IconButton --"
 },
 "shadow": false,
 "cursor": "hand"
}],
 "width": "100%"
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
