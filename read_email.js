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

var options = { "request": {
                  "headers": false, "body": true}};

var emails_to_process = 0;

imap.connect(function(err) {
  if (err) { reportError(err); }
  console.log("opening the mailbox");

  imap.openBox('INBOX', false, function(box) {
    console.log("Searching the inbox");
    imap.search(['UNDELETED'], function(err, email_ids) {
      
      emails_to_process = email_ids.length;

      for (var i=0; i <  email_ids.length; i++) {
        process.emit('fetch-email', email_ids[i]);
      }

      console.log('returning from search');
    });
  });  
});

process.on('fetch-email', function(id) {
  imap.fetch(id, options, function(err, emails){
    process.emit('handle-email', emails[0]);
  });
});

process.on('handle-email', function(email){
  var f = function() {
    console.log('Handled email: ' +  email.id);
    process.emit('finished-handling');
  };
  
  if (email.id == 5 || email.id == 7) {
    setTimeout(f, 10000*Math.random());
  } else {
    f();
  }
});

process.on('finished-handling', function() {
  emails_to_process--;
  if(emails_to_process <= 0) {
    imap.logout();
  }
});

process.on('start-processing', function() {
  for (var i=0; i <  emails_to_process.length; i++) {
    process.emit('process-email', emails_to_process[i]);
  }
});

process.on('process-email', function(id) {
  console.log("Fetching: " + id);

  imap.fetch(id, options, function(err, email) {
    process.emit('finished-processing-email', email);
  });

  for (var i=0; i <  emails_to_process.length; i++) {
    console.log("trying to remove: " + id);
    console.dir(emails_to_process);
    if (id.toString() == emails_to_process[i]) {
      emails_to_process.splice(i, 1);
      break;
    }
  }
  
  process.emit('finished-processing-email');
});
