const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.delete({ where: { id: 'cmm3jn4rf0003l704w51wmlwd' } })
    .then(() => console.log('Successfully deleted user and all cascaded relations!'))
    .catch(e => {
        console.error('Delete failed:');
        console.error(e.message);
    })
    .finally(() => p.$disconnect());
