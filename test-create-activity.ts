import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const admin = await prisma.user.findFirst({
            where: { role: 'ADMIN' }
        })

        if (!admin) {
            console.log('No admin user found.')
            return
        }

        console.log(`Using admin: ${admin.email} (${admin.id})`)

        const activity = await prisma.activity.create({
            data: {
                title: "Test Activity " + Date.now(),
                description: "Test Description",
                category: "Test",
                date: new Date(),
                location: "Test Location",
                creatorId: admin.id,
                files: []
            }
        })

        console.log('Activity created successfully:', activity.id)

        // Clean up
        await prisma.activity.delete({ where: { id: activity.id } })
        console.log('Test activity cleaned up.')

    } catch (e) {
        console.error('Error in test-create-activity:')
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
