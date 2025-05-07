import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { randomBytes } from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email já verificado' },
        { status: 400 }
      );
    }

    // Gerar token de verificação
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token,
        expires,
      },
    });

    // Enviar email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;
    
    await resend.emails.send({
      from: 'AgroMarket <noreply@agromarket.com>',
      to: user.email,
      subject: 'Verifique seu email - AgroMarket',
      html: `
        <h1>Bem-vindo ao AgroMarket!</h1>
        <p>Clique no link abaixo para verificar seu email:</p>
        <a href="${verificationUrl}">Verificar Email</a>
        <p>Este link expira em 24 horas.</p>
        <p>Se você não solicitou esta verificação, ignore este email.</p>
      `,
    });

    return NextResponse.json(
      { message: 'Email de verificação enviado' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao enviar email de verificação:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar email de verificação' },
      { status: 500 }
    );
  }
} 