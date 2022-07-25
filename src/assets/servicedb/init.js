const fs = require('fs');
const { pool } = require('./index');

const init = async () => {
    try {
        const fileSQL = await fs.readFileSync('src/assets/servicedb/init.sql', { encoding: 'utf8' });

        const splits = fileSQL.split(';');

        for (let i = 0; i < splits.length; i += 1) {
            const sql = splits[i];

            if (sql.indexOf('CREATE') !== -1) {
                const [res] = await pool.promise().execute(sql);
                console.info(sql);
                console.log(res);
            }
        }
    } catch(e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

init();