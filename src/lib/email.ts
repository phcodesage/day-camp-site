import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export type RegistrationEmailData = {
  parentName: string;
  studentName: string;
  email: string;
  phone: string;
  activities: string[];
  preferredDays: string;
  startDate: string;
  notes?: string;
};

export async function sendRegistrationConfirmationEmail(
  data: RegistrationEmailData
): Promise<void> {
  const fromEmail = process.env.FROM_EMAIL || 'noreply@exceedlearningcenterny.com';
  const adminEmail = process.env.ADMIN_EMAIL;

  // Ensure from field is in correct format - if FROM_EMAIL already includes name, use it as-is
  const fromField = fromEmail.includes('<') && fromEmail.includes('>')
    ? fromEmail
    : `Exceed Learning Center <${fromEmail}>`;

  const formattedStartDate = data.startDate
    ? new Date(data.startDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Not specified';

  // Email to parent
  await resend.emails.send({
    from: fromField,
    to: data.email,
    subject: 'Registration Confirmation - Kids After School Program',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #c74444;">Registration Confirmation</h2>
        <p>Dear ${data.parentName},</p>
        <p>Thank you for registering your child <strong>${data.studentName}</strong> for our After School Program!</p>
        
        <div style="background: #f6dedd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1a2945; margin-top: 0;">Registration Details:</h3>
          <ul style="line-height: 1.8;">
            <li><strong>Student Name:</strong> ${data.studentName}</li>
            <li><strong>Activities:</strong> ${data.activities.join(', ')}</li>
            <li><strong>Preferred Days:</strong> ${data.preferredDays}</li>
            <li><strong>Desired Start Date:</strong> ${formattedStartDate}</li>
            ${data.notes ? `<li><strong>Notes:</strong> ${data.notes}</li>` : ''}
          </ul>
        </div>
        
        <p>We will contact you at <strong>${data.phone}</strong> or <strong>${data.email}</strong> to finalize your enrollment and arrange payment.</p>
        
        <p>If you have any questions, please contact us at:</p>
        <ul>
          <li>Email: Afterschool@exceedlearningcenterny.com</li>
          <li>Phone: +1 (516) 226-3114</li>
          <li>Address: 1360 Willis Ave, Albertson, NY</li>
        </ul>
        
        <p style="margin-top: 30px;">Best regards,<br><strong>Exceed Learning Center Team</strong></p>
      </div>
    `,
  });

  // Admin notification email (if ADMIN_EMAIL is configured)
  if (adminEmail) {
    await resend.emails.send({
      from: fromField,
      to: adminEmail,
      subject: `New After School Registration - ${data.studentName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #c74444;">New Registration Received</h2>
          
          <div style="background: #f6dedd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1a2945; margin-top: 0;">Registration Details:</h3>
            <ul style="line-height: 1.8;">
              <li><strong>Parent Name:</strong> ${data.parentName}</li>
              <li><strong>Student Name:</strong> ${data.studentName}</li>
              <li><strong>Email:</strong> ${data.email}</li>
              <li><strong>Phone:</strong> ${data.phone}</li>
              <li><strong>Activities:</strong> ${data.activities.join(', ')}</li>
              <li><strong>Preferred Days:</strong> ${data.preferredDays}</li>
              <li><strong>Desired Start Date:</strong> ${formattedStartDate}</li>
              ${data.notes ? `<li><strong>Notes:</strong> ${data.notes}</li>` : ''}
            </ul>
          </div>
          
          <p>Please contact the parent to finalize enrollment and arrange payment.</p>
        </div>
      `,
    });
  }
}
