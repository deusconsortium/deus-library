/**
 * This is an example of using WebSampConnector on your site. Feel free to use 
 * it as a template for your own. You can freely change the following code for
 * your needs, including routines, values, names of functions and variables,
 * or you can even delete parts of code you do not need.
 *
 * Please note, however, that names of properties of WebSampConnector
 * (i.e. `onlineHandler` and `pointAtSkyHandler`) are predefined and cannot
 * be changed.
 * 
 * @requires websampconnector.js
 * @see http://vo.imcce.fr/webservices/samp/?manual 
 * @author J. Berthier <berthier@imcce.fr> (IMCCE/OBSPM/VOParis Data Centre)
 * @author A. Tregoubenko <http://arty.name>
 * @version 1.5, 2010-04-01
 * @copyright 2010, VO-Paris Data Centre <http://vo.obspm.fr/>
 * @license CeCILL-C FREE SOFTWARE LICENSE <http://www.cecill.info>
 */

// Check whether or not the WebSampConnector namespace is defined
if (typeof WebSampConnector == "undefined") {
  alert("Error: the WebSampConnector namespace is undefined.\nLoad websampconnector.js before this script.");
}

/*
 * WebSampConnector configuration
 */
WebSampConnector.configure({
  jAppletId: 'WebSampConnectorApplet',
  jAppletCodeBase:'resources/applets/', 
  jAppletVersion: '1.6'
});

/*
 * The onlineHandler method will be called by the Java applet as soon
 * as the connection is established and is ready to handle events. This
 * method will update an icon which shows the connection status.
 * @param status the hub status string: connected or disconnected
 */
WebSampConnector.onlineHandler = function(status){
	console.log("oonlinehandler : "+status);
	if(status == 'disconnected'){
		alert("Any Samp enabled application (and so any Samp hub) seems to be launched. \n " +
 		"Please launch such an application and try again.");
	}
	deuvoSamp.updateStatusIcon(status);
};

/*
 * The pointAtSkyHandler method will be called by the Java applet when 
 * it will receive coord.pointAt.sky event: at this moment example handler 
 * will print coordinates in textarea.
 * @param ra the pointed right ascension
 * @param dec the pointed declination
 */
WebSampConnector.pointAtSkyHandler = function(ra, dec){
   deuvoSamp.pointAtSkyHandler(ra, dec);
};

/*
 * The highlightRowHandler will be called by the Java applet when it will 
 * receive table.highlight.row event. At this moment example handler will 
 * print index of row to highlight in textarea.
 * @param tableId the Id of the table which contains the row to highlight
 * @param url the URL of the resource
 * @param row the row index to highlight
 */
WebSampConnector.highlightRowHandler = function(tableId, url, row){
   deuvoSamp.highlightRowHandler(tableId, url, row);
};

/*
 * The selectRowListHandler method will be called by the Java applet when 
 * it will receive table.select.rowList event. At this moment example handler 
 * will print indexes of rows to highlight in textarea.
 * @param tableId the Id of the table which contains the rows to highlight
 * @param url the URL of the resource
 * @param rows an array of the row index to highlight
 */
WebSampConnector.selectRowListHandler = function(tableId, url, rows){
   deuvoSamp.selectRowListHandler(tableId, url, rows);
};

//----------------------------------------------------------------------------
// deuvoSamp namespace
//----------------------------------------------------------------------------
var deuvoSamp = {

   // Id of the html img element of the status icon
   iconId: 'deuvoHubStatusIcon',
   // Prefix of the hub status icon names (e.g. icons/hub-)
   iconPrefix: 'resources/images/samp/',
   // Extension of the hub status icon filename
   iconExt: '.png',
   // Id of the HTML element which display the events broadcasted by VO-applications
   handlerId: '',
   
   /* 
    * This method display the given icon image
    * @param string the filename of the status icon
    */
   setStatusIcon: function(iconUrl) {
      var icon = document.getElementById(this.iconId);
      if (icon) {
         icon.src = iconUrl;
      }
   },

   /*
    * This method changes the icon which indicates the status of the connection to the hub.
    * @param status Hub status string: connected, disconnected
    */
   updateStatusIcon: function(status) {
      this.setStatusIcon(this.iconPrefix + status + this.iconExt);
   },

   
   /*
    * This method allows the client to know if he's connected 
    * or not to the running hub.
    */
   getConnectionStatus: function() {
      try {
         if (WebSampConnector.isConnected()) {
            alert('Connected');
         } else {
            alert('Not connected');
         }
      } catch (e) {
         WebSampConnector.log('WebSampConnector.getConnectionStatus:\n' + e);
      }
   },

   /*
    * This method unregisters the client and terminates the connection
    */
   disconnectHub: function() {
      try {
         if (WebSampConnector.disconnect()) {
            this.updateStatusIcon("disconnected");
         } else {
            alert("OOOPS!");
         }
      } catch (e) {
         WebSampConnector.log('WebSampConnector.disconnectHub:\n' + e);
      }
   },

   /*
    * This method allows the client to know which clients are registered (mtype="")
    * or which clients have subscribed a given MType (mtype!="")
    * @param mtype the given MType (e.g. table.load.votable)
    */
   getClients: function(mtype) {
      try {
         if (mtype) {
            var clients = WebSampConnector.getSubscribedClients([mtype]);
            var textn = "Subscribed clients of MType: " + mtype + "\n";
         } else {
            var clients = WebSampConnector.getRegisteredClients();
            var textn = "Registered clients:\n";
         }
         for (i=0; i<clients.length; i++) {
            textn += ' * Id: ' + clients[i].id + '\n' 
                    + '  - Name: ' + clients[i].name + '\n' 
                    + '  - Description: ' + clients[i].descriptionText + '\n';
         }
         alert(textn);
      } catch (e) {
         WebSampConnector.log('WebSampConnector.getClients:\n' + e);
      }      
   },

   /*
    * Formats a number in a sexagesimal representation (e.g. deg:min:sec)
    * @param num a decimal number
    * @return a string containing the sexagesimal representation of the number 
    */
   decToSexa: function(num) {
      var deg = parseInt(num);
      num -= deg;
      num *= 60;
      var min = parseInt(num);
      num -= min;
      num *= 60;
      var sec = parseInt(num);
      return '' + deg + ':' + min + ':' + sec;
   },

   /*
    * Formats a number in a decimal representation (e.g. xx.xxx)
    * @param sexa a sexagesimal representation (e.g. deg:min:sec)
    * @return a string containing the decimal representation of the input 
    */
   sexaToDec: function(sexa) {
      var parts = sexa.split(':');
      return 3600 * parts[0] + 60 * parts[1] + 1 * parts[2];
   },

   /*
    * This method allows a VO application to point a given celestial coordinate in the Web page
    * @param ra the pointed right ascension
    * @param dec the pointed declination
    */
   pointAtSkyHandler: function(ra, dec) {
      var textarea = document.getElementById(this.handlerId);
      if (textarea) {
         textarea.value = "RA=" + this.decToSexa(ra) + " ; DEC=" + this.decToSexa(dec);
      }
   },
    
   /*
    * This method allows a VO application to highlight a given row in the Web page
    * @param tableId the Id of the table which contains the row to highlight
    * @param url the URL of the resource
    * @param row the row index to highlight
    */
   highlightRowHandler: function(tableId, url, row) {
      var textarea = document.getElementById(this.handlerId);
      if (textarea) {
         textarea.value = "Highlighted row: #" + row;
      }
   },
    
   /*
    * This method allows a VO application to highlight a selection of rows in the Web page
    * @param tableId the Id of the table which contains the rows to highlight
    * @param url the URL of the resource
    * @param rows an array of the row index to highlight
    */
   selectRowListHandler: function(tableId, url, rows) {
      var text = "Selected rows: ";
      for (var i=0; i<rows.length; i++) {
         text += '#' + rows[i] + ', ';
      }
      var textarea = document.getElementById(this.handlerId);
      if (textarea) {
         textarea.value = text;
      }
   },

   /*
    * Change the message displayed in the this.handlerId HTML element
    * @param msg the message to display
    * @param color the color of the text
    */
   changeMsgStatus: function(msg, color) {
      var hubMsg = document.getElementById(this.handlerId);
      if (hubMsg) {
         hubMsg.style.color = color;
         hubMsg.value = msg;
      }
   },

   
   /*
    * Toggle connected/disconnected states of the WebSampConnector
    */
   toggleConnection: function() {
	   console.log("toggleconnection");
     var connected;
     try {
       if (WebSampConnector.isConnected()) {
    	   console.log("is connected");
         connected = true;
       } else {
         connected = false; 
       }
     } catch (e) {
       connected = false; 
     }
     if (!connected) {
       this.setStatusIcon('resources/images/samp/connecting.gif'); 
       
       WebSampConnector.connect();
     } else {
       this.disconnectHub();
       this.updateStatusIcon("disconnected");
       this.changeMsgStatus("disconnected", "red");
     }
   }, 
   
   /*
    * Open and close the interface container
    * @param id the name of the main div which contains the interface
    */
   toggleDiv: function(id) {
     var divStyle = document.getElementById(id).style;
     var disp = divStyle.display;  
     divStyle.display = (disp == 'none') ? 'block' : 'none'; 
   },
   
   /*
    * Open a given div
    * @param id the name of the div to open
    */
   openDiv: function(id) {
     var divStyle = document.getElementById(id).style;
     divStyle.display = 'block'; 
   },
   
   /*
    * Close a given div
    * @param id the name of the div to open
    */
   closeDiv: function(id) {
     var divStyle = document.getElementById(id).style; 
     divStyle.display = 'none'; 
   }
};
