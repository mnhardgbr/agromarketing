import Link from 'next/link'
import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa'

const footerLinks = {
  company: {
    title: 'Empresa',
    links: [
      { text: 'Sobre nós', href: '/sobre' },
      { text: 'Nossa história', href: '/historia' },
      { text: 'Missão e Valores', href: '/missao' },
      { text: 'Trabalhe conosco', href: '/carreiras' },
    ],
  },
  institutional: {
    title: 'Institucional',
    links: [
      { text: 'Política de Privacidade', href: '/privacidade' },
      { text: 'Termos de Uso', href: '/termos' },
      { text: 'Política de Cookies', href: '/cookies' },
      { text: 'FAQ', href: '/faq' },
    ],
  },
  categories: {
    title: 'Categorias',
    links: [
      { text: 'Bovinos', href: '/categoria/bovinos' },
      { text: 'Equinos', href: '/categoria/equinos' },
      { text: 'Ovinos', href: '/categoria/ovinos' },
      { text: 'Caprinos', href: '/categoria/caprinos' },
    ],
  },
  contact: {
    title: 'Contato',
    links: [
      { text: 'Central de Ajuda', href: '/ajuda' },
      { text: 'Fale Conosco', href: '/contato' },
      { text: 'Suporte ao Vendedor', href: '/suporte-vendedor' },
      { text: 'Suporte ao Comprador', href: '/suporte-comprador' },
    ],
  },
}

const socialLinks = [
  { Icon: FaFacebook, href: 'https://facebook.com', label: 'Facebook' },
  { Icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
  { Icon: FaWhatsapp, href: 'https://whatsapp.com', label: 'WhatsApp' },
  { Icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-white text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.text}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors duration-200"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              {socialLinks.map(({ Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon className="w-6 h-6" />
                </Link>
              ))}
            </div>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} AgroMarket. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 