const fs = require('fs');
const { pool } = require('./index');

const drop = async () => {
    try {
        const fileSQL = await fs.readFileSync('src/assets/servicedb/drop.sql', { encoding: 'utf8' });

        const splits = fileSQL.split(';');
        
        for (let i = 0; i < splits.length; i += 1) {
            const sql = splits[i]

            if (sql.indexOf('DROP') !== -1) {
                const [res, err] = await pool.promise().execute(sql);
                console.log('DB DROP COMPLETE');
            }
        }
    } catch(e) {
        console.error(e);
    } finally {
        process.exit(0) ;
    }
}

drop();