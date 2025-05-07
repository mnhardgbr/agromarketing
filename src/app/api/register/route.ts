import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prismadb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Recebendo cadastro:', body);
    const { name, email, password, phone, cpf } = body;

    if (!name || !email || !password) {
      console.log('Campos obrigatórios não preenchidos');
      return NextResponse.json(
        { message: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      );
    }

    // Verifica se o email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('Email já está em uso:', email);
      return NextResponse.json(
        { message: 'Email já está em uso' },
        { status: 400 }
      );
    }

    // Verifica se o CPF já está em uso (se fornecido)
    if (cpf) {
      const existingCpf = await prisma.user.findUnique({
        where: { cpf },
      });

      if (existingCpf) {
        console.log('CPF já está em uso:', cpf);
        return NextResponse.json(
          { message: 'CPF já está em uso' },
          { status: 400 }
        );
      }
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        cpf,
      },
    });

    console.log('Usuário criado:', user);

    return NextResponse.json(
      {
        message: 'Usuário criado com sucesso',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Erro ao criar usuário' },
      { status: 500 }
    );
  }
} 