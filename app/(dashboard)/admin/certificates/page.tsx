import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import CertificationClient from "@/components/admin/CertificationClient";

const prisma = new PrismaClient();

export default async function CertificationZonePage() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    const configs = await prisma.siteConfig.findMany({
        where: {
            key: {
                in: [
                    'cert_college_logo',
                    'cert_club_logo',
                    'cert_signature_url',
                    'cert_signer_name',
                    'cert_signer_title'
                ]
            }
        }
    });

    const configMap = configs.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>);

    const initialConfig = {
        collegeLogoUrl: configMap['cert_college_logo'] || "",
        clubLogoUrl: configMap['cert_club_logo'] || "",
        signatureUrl: configMap['cert_signature_url'] || "",
        signerName: configMap['cert_signer_name'] || "A.R Rafi",
        signerTitle: configMap['cert_signer_title'] || "Moderator"
    };

    return <CertificationClient initialConfig={initialConfig} />;
}
