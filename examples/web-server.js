require('express')().use(require('express').static('.')).use(require('serve-index')('.', {icons: true})).listen(process.argv[2] || process.env.PORT || 8000);
