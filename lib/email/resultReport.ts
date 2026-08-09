import nodemailer from 'nodemailer';

export async function sendResultReportEmail(
  toEmail: string,
  applicantName: string,
  chosenPanel: string,
  totalMarks: number,
  clubComment: string,
  judgeMarks: { judge: { name: string }, mark: number }[],
  progress: { hop: { title: string, order: number }, isCompleted: boolean }[]
) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('Missing SMTP configuration');
    throw new Error('SMTP configuration is missing');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const marksHtml = judgeMarks.map(jm => `<li><strong>${jm.judge.name}:</strong> ${jm.mark}</li>`).join('');
  const progressHtml = progress
    .sort((a, b) => a.hop.order - b.hop.order)
    .map(p => `<li>${p.isCompleted ? '✅' : '❌'} ${p.hop.title}</li>`).join('');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; text-align: center;">Panel Application Result Report</h2>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <p><strong>Applicant Name:</strong> ${applicantName}</p>
        <p><strong>Chosen Panel:</strong> ${chosenPanel || 'N/A'}</p>
        <p><strong>Total Marks:</strong> ${totalMarks}</p>
        
        ${clubComment ? `<p><strong>Club Comment:</strong> <br/> <em>${clubComment}</em></p>` : ''}
      </div>

      <div style="margin-top: 20px;">
        <h3>Judge Evaluations</h3>
        <ul>
          ${marksHtml || '<li>No marks available</li>'}
        </ul>
      </div>

      <div style="margin-top: 20px;">
        <h3>Progress Tracker</h3>
        <ul style="list-style: none; padding-left: 0;">
          ${progressHtml || '<li>No progress recorded</li>'}
        </ul>
      </div>

      <p style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  `;

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: toEmail,
    subject: 'Your Panel Application Result Report',
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
}
