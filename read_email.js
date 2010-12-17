var ImapConnection = require('imap').ImapConnection, 
    sys = require('sys'),
    imap = new ImapConnection({
      username: 'dropnode@gmail.com',
      password: 'grnodeug',
      host: 'imap.gmail.com',
      port: 993,
      secure: true
    });
    
var reportError = function(err) {
  console.log('There was an error');
  console.dir(err);
  process.exit(1);
};

imap.connect(function(err) {
  if (err) { reportError(err); }
  console.log("opening the mailbox");

  imap.openBox('INBOX', false, function(box) {
    console.log("Searching the inbox");
    imap.search(['UNDELETED'], function(err, email_ids) {
      var options = { "request": {
                        "headers": false, "body": true}};
      console.log("fetching emails");
      imap.fetch(email_ids, options, function(err, emails) {
        process.emit('emails-found', emails);
      });
    });
  });  
});

process.on('emails-found', function(emails) {
  console.log("found some emails");
  console.dir(emails);
  process.emit('emails-finished');
});

process.on('emails-finished', function() {
  console.log("finished them");
  imap.logout();
});
