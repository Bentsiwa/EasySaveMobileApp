/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log('Received Device Ready Event');
        console.log('calling setup push');
        app.setupPush();
    },
    setupPush: function() {
        console.log('calling push init');
        var push = PushNotification.init({
            "android": {
                "senderID": "270845881290"
            },
            "browser": {},
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true
            },
            "windows": {}
        });
        console.log('after init');

        push.on('registration', function(data) {
        //           messaging.requestPermission().then(function() {
        //   console.log('Notification permission granted.');
        //   // TODO(developer): Retrieve an Instance ID token for use with FCM.
        //   // ...
        // }).catch(function(err) {
        //   console.log('Unable to get permission to notify.', err);
        // });

            console.log('registration event: ' + data.registrationId);

            alert('registration event: ' + data.registrationId);
            id.innerHTML=data.registrationId;

            var oldRegId = localStorage.getItem('registrationId');
            if (oldRegId !== data.registrationId) {
                // Save new registration ID
                localStorage.setItem('registrationId', data.registrationId);
                // Post registrationId to your app server as the value has changed
            }

            var parentElement = document.getElementById('registration');
            var listeningElement = parentElement.querySelector('.waiting');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');

            alert("posting");
            var id= data.registrationId;
            //sending notification
            var url = "https://fcm.googleapis.com/v1/projects/myproject-b5ae1/messages:send";
            var method = "POST";
            var postData = '{"message":{"token" : "'+id+'","notification" : {"body" : "This is an FCM notification message!",  "title" : "FCM Message",}}}';

            // You REALLY want shouldBeAsync = true.
            // Otherwise, it'll block ALL execution waiting for server response.
            var shouldBeAsync = true;

            var request = new XMLHttpRequest();

            // Before we send anything, we first have to say what we will do when the
            // server responds. This seems backwards (say how we'll respond before we send
            // the request? huh?), but that's how Javascript works.
            // This function attached to the XMLHttpRequest "onload" property specifies how
            // the HTTP response will be handled.
            request.onload = function () {

               // Because of javascript's fabulous closure concept, the XMLHttpRequest "request"
               // object declared above is available in this function even though this function
               // executes long after the request is sent and long after this function is
               // instantiated. This fact is CRUCIAL to the workings of XHR in ordinary
               // applications.

               // You can get all kinds of information about the HTTP response.
               var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
               var data = request.responseText; // Returned data, e.g., an HTML document.
            }

            request.open(method, url, shouldBeAsync);

            request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            // Or... request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
            // Or... whatever

            // Actually sends the request to the server.
            request.send(postData);

        });

        push.on('error', function(e) {
            console.log("push error = " + e.message);
            alert("error "+e.message);
        });

        push.on('notification', function(data) {
            console.log('notification event');
          alert('notification event');
          alert(data.message);
            navigator.notification.alert(
                data.message,         // message
                null,                 // callback
                data.title,           // title
                'Ok'                  // buttonName
            );
       });
    }
};
