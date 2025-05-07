import { ForgotPasswordForm } from '@/components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Recuperação de Senha
          </h1>
          <p className="text-sm text-muted-foreground">
            Digite seu email para receber um link de recuperação de senha
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </div>
  );
} 