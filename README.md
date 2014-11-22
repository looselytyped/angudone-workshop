# Angudone

## Software needed
- Java 1.6 or greater
- [FireFox](http://www.mozilla.org/en-US/firefox/new/) or [Google Chrome](https://www.google.com/intl/en/chrome/browser/)
    - If you opted (or have installed FireFox) I suggest you install the [Firebug](https://getfirebug.com/) plugin
- [Git](http://git-scm.com/downloads)
    - There are downloads available for all major platforms
- [Leiningen](http://leiningen.org/)
    - There are downloads available for all major platforms. **Note** that if you are on a Mac and have [HomeBrew](http://brew.sh/) installed this is a one-liner
- You favorite text editor or JavaScript IDE. Some suggestions are
    - SublimeText
    - Emacs/VI
    - IntelliJ
    
## Workshop
- Clone the [repository](https://github.com/looselytyped/angudone-workshop) on Github 

## Test the install
- Make sure Git is available on your path

        Open up a new terminal window    
        $ git --version  
        > # Anything greater than 2 will do
        > git version 2.4.5
    
- Make sure leiningen is available

        $ lein --version
        > Leiningen 2.5.0 on Java 1.7.0_04 Java HotSpot(TM) 64-Bit Server VM
        
- Wake up the application

        # at the terminal
        # cd _into_ where you cloned the repository above. 
        $ lein ring server
        # This will download a whole bunch of files from Maven Central 
        # and will end with
        # Started server on port 3000
        
    - This should automatically open up your default browser to `http://localhost:3000/` (If it does not just go to that URL). You should see a HTML page announcing `Angudone`
    
- Ensure that the `REST` endpoints are active
	- If you simply using Firefox then `Right-Click -> Inspect Element` (this will open the Firefox Developer Console) and then go to the `Console` tab (second from the left)
    - If you are using FireFox with FireBug then `Right-Click -> Inspect Element with FireBug` (this will open the Firebug Inspector) and then go to the `Console` tab (left most)
    - If you are using Chrome then `Right-Click -> Inspect Element` (this will open the Chrome Inspector) and then go to the `Console` tab (right most)
    
- All `Console`s give you the ability to run JavaScript code. Run the following

        http.get("todos")
            .then(function(resp) {
              console.log("There are " + resp.data.length + " todos");
            }, function(err) {
              console.error("Oh Noes! Something went wrong" + data);
            });
             
    You should see a a valid response indicated by `There are 0 todos` 
    
## You are all set! See you soon!
