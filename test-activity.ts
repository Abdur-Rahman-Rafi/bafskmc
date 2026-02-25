import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const activityCount = await prisma.activity.count()
        console.log(`Connection successful. Activity count: ${activityCount}`)

        // Try to list tables/models to be sure
        console.log('Successfully queried Activity table.')
    } catch (e) {
        console.error('Error connecting to database or querying Activity table:')
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
