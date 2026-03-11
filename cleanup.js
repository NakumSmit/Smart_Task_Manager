const fs = require('fs');
['public/js/ui/Renderer.js', 
'public/js/utils/helpers.js', 
'public/js/models/task.js']
.forEach(f => {
    try {
        if (fs.existsSync(f)) {
            fs.unlinkSync(f);
            console.log('Deleted ' + f);
        }
    } catch (e) {
        console.error(e.message);
    }
});
