import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export type RegistrationEmailData = {
  parentName: string;
  studentName: string;
  email: string;
  phone: string;
  grade?: string;
  subjects?: string[];
  activities: string[];
  preferredDays: string;
  tuitionPlan?: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  pianoLesson?: boolean;
  pianoFrequency?: string;
  chessAddon?: boolean;
  chessFrequency?: string;
  totalAmount?: number;
};

export async function sendRegistrationConfirmationEmail(
  data: RegistrationEmailData
): Promise<void> {
  if (!resend) {
    console.warn('Resend API key is missing. Skipping email confirmation.');
    return;
  }
  const fromEmail = process.env.FROM_EMAIL || 'noreply@exceedlearningcenterny.com';
  const adminEmail = process.env.ADMIN_EMAIL;

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

  const formattedEndDate = data.endDate
    ? new Date(data.endDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const valorPayUrl = 'https://securelink-prod.valorpaytech.com:4430/?redirect=1&uid=9c67fe06-8538-11f1-8d9b-128462456e49';

  // Email to parent
  await resend.emails.send({
    from: fromField,
    to: data.email,
    subject: 'Registration Confirmation - Exceed Learning Center',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a2945;">
        <h2 style="color: #c74444;">Registration Received!</h2>
        <p>Dear ${data.parentName},</p>
        <p>Thank you for registering your child <strong>${data.studentName}</strong> for our After School & Tutoring Program at Exceed Learning Center!</p>
        
        <div style="background: #f6dedd; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2b4b4;">
          <h3 style="color: #1a2945; margin-top: 0; border-bottom: 1px solid #d49898; padding-bottom: 8px;">Registration Summary:</h3>
          <ul style="line-height: 1.8; list-style: none; padding-left: 0;">
            <li><strong>Student Name:</strong> ${data.studentName}</li>
            ${data.grade ? `<li><strong>Grade:</strong> ${data.grade}</li>` : ''}
            ${data.subjects && data.subjects.length > 0 ? `<li><strong>Subjects / Field:</strong> ${data.subjects.join(', ')}</li>` : ''}
            <li><strong>Selected Tutoring/Program Days:</strong> ${data.preferredDays}</li>
            <li><strong>Start Date:</strong> ${formattedStartDate}</li>
            ${formattedEndDate ? `<li><strong>End Date:</strong> ${formattedEndDate}</li>` : ''}
            ${data.pianoLesson ? `<li><strong>Piano Lesson Add-on:</strong> Yes (${data.pianoFrequency || 'Standard'})</li>` : ''}
            ${data.chessAddon ? `<li><strong>Chess Add-on:</strong> Yes (${data.chessFrequency || 'Standard'})</li>` : ''}
            ${data.notes ? `<li><strong>Notes:</strong> ${data.notes}</li>` : ''}
          </ul>

          <div style="background: #ffffff; padding: 15px; border-radius: 8px; margin-top: 15px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #666;">Calculated Total Amount:</p>
            <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: bold; color: #c74444;">$${(data.totalAmount || 0).toFixed(2)}</p>
          </div>
        </div>

        <div style="background: #eef7f9; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #bce2e8; text-align: center;">
          <h3 style="color: #1a7b8e; margin-top: 0;">Complete Your Payment</h3>
          <p style="margin-bottom: 15px;">Please click the button below to enter your total amount of <strong>$${(data.totalAmount || 0).toFixed(2)}</strong> on our secure Valor Pay portal:</p>
          <a href="${valorPayUrl}" target="_blank" style="display: inline-block; background-color: #c74444; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Pay $${(data.totalAmount || 0).toFixed(2)} via Valor Pay</a>
        </div>
        
        <p>We will also contact you at <strong>${data.phone}</strong> or <strong>${data.email}</strong> if any further details are required.</p>
        
        <p>If you have any questions, please contact us at:</p>
        <ul style="line-height: 1.6;">
          <li>Email: kidsprograms@exceedlearningcenterny.com</li>
          <li>Phone: +1 (516) 226-3114</li>
          <li>Address: 1360 Willis Ave, Albertson, NY</li>
        </ul>
        
        <p style="margin-top: 30px;">Best regards,<br><strong>Exceed Learning Center Team</strong></p>
      </div>
    `,
  });

  // Admin notification email
  if (adminEmail) {
    await resend.emails.send({
      from: fromField,
      to: adminEmail,
      subject: `New Registration ($${(data.totalAmount || 0).toFixed(2)}) - ${data.studentName}`,
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
              ${data.grade ? `<li><strong>Grade:</strong> ${data.grade}</li>` : ''}
              ${data.subjects && data.subjects.length > 0 ? `<li><strong>Subjects / Field:</strong> ${data.subjects.join(', ')}</li>` : ''}
              <li><strong>Preferred Days:</strong> ${data.preferredDays}</li>
              <li><strong>Start Date:</strong> ${formattedStartDate}</li>
              ${data.pianoLesson ? `<li><strong>Piano Lesson Add-on:</strong> Yes</li>` : ''}
              ${data.chessAddon ? `<li><strong>Chess Add-on:</strong> Yes</li>` : ''}
              <li><strong>Total Amount Calculated:</strong> $${(data.totalAmount || 0).toFixed(2)}</li>
              ${data.notes ? `<li><strong>Notes:</strong> ${data.notes}</li>` : ''}
            </ul>
          </div>
        </div>
      `,
    });
  }
}

