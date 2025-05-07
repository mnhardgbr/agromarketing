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

    // Gerar token de recuperação
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hora

    await prisma.passwordResetToken.create({
      data: {
        identifier: user.email,
        token,
        expires,
      },
    });

    // Enviar email
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
    
    await resend.emails.send({
      from: 'AgroMarket <noreply@agromarket.com>',
      to: user.email,
      subject: 'Recuperação de Senha - AgroMarket',
      html: `
        <h1>Recuperação de Senha</h1>
        <p>Você solicitou a recuperação de senha da sua conta no AgroMarket.</p>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetUrl}" style="
          background-color: #10B981;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          display: inline-block;
          margin: 20px 0;
        ">Redefinir Senha</a>
        <p>Este link expira em 1 hora.</p>
        <p>Se você não solicitou a recuperação de senha, ignore este email.</p>
        <p>Atenciosamente,<br>Equipe AgroMarket</p>
      `,
    });

    return NextResponse.json(
      { message: 'Email de recuperação enviado' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao enviar email de recuperação:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a recuperação de senha' },
      { status: 500 }
    );
  }
} 