import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, idNumber, phone, pin, signupDate } = req.body;
    
    // Insert the new user into the database
    await sql`
      INSERT INTO users (first_name, last_name, id_number, phone, pin, signup_date)
      VALUES (${firstName}, ${lastName}, ${idNumber}, ${phone}, ${pin}, ${signupDate})
    `;
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}