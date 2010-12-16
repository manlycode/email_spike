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
  if (err) { reportError(err); };
  
  imap.openBox('INBOX', false, function(box) {
    imap.search(['UNDELETED'], function(err, email_ids) {
      var options = {"request": {"headers": false, "body": true}};
      imap.fetch(email_ids, options, function(err, result) {
        console.log(result);
      });
    });
  });  
});