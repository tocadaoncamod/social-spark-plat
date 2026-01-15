// Configuração especializada para Moda - Atacado e Varejo
// Foco: Moda Feminina, Masculina, Infantil + Acessórios

export interface FashionKnowledge {
  categorias: string[];
  modeloNegocio: {
    tipo: string;
    descricao: string;
    diferenciais: string[];
  };
  subcategorias: Record<string, string[]>;
  tendencias2026: string[];
  publicosAlvo: Record<string, string>;
  estilos: string[];
  temporadas: string[];
  terminologias: Record<string, string>;
  faixasPreco: Record<string, string>;
}

export interface PlatformLimits {
  titulo: { max: number; recomendado: number };
  descricao: { max: number; recomendado: number };
  hashtags: { max: number; recomendado: number };
  formatoImagem: string;
  formatoVideo: string;
  duracaoVideo: string;
  dicas: string[];
}

// Conhecimento especializado em moda - Atacado e Varejo
export const FASHION_KNOWLEDGE: FashionKnowledge = {
  modeloNegocio: {
    tipo: 'Atacado → Varejo',
    descricao: 'Compra em atacado com preços competitivos para revenda no varejo com margem de lucro',
    diferenciais: [
      'Preços de atacado repassados ao consumidor',
      'Novidades direto dos fabricantes',
      'Variedade e estoque sempre renovado',
      'Peças exclusivas e limitadas',
      'Condições especiais para atacado'
    ]
  },
  categorias: [
    'Moda Feminina',
    'Moda Masculina', 
    'Moda Infantil',
    'Acessórios Femininos',
    'Acessórios Masculinos',
    'Acessórios Infantis'
  ],
  subcategorias: {
    feminino: [
      'Vestidos',
      'Blusas e Camisas',
      'Calças e Shorts',
      'Saias',
      'Conjuntos',
      'Macacões',
      'Casacos e Jaquetas',
      'Moda Íntima',
      'Moda Praia',
      'Moda Fitness',
      'Plus Size Feminino'
    ],
    masculino: [
      'Camisetas',
      'Camisas',
      'Calças e Bermudas',
      'Jaquetas e Blazers',
      'Moda Esportiva',
      'Cuecas e Pijamas',
      'Moda Praia Masculina',
      'Plus Size Masculino'
    ],
    infantil: [
      'Bebê (0-2 anos)',
      'Kids (2-8 anos)',
      'Juvenil (8-14 anos)',
      'Conjuntinhos',
      'Vestidos Infantis',
      'Moda Escolar',
      'Pijamas Infantis',
      'Moda Praia Infantil'
    ],
    acessoriosFeminino: [
      'Bolsas',
      'Carteiras',
      'Cintos',
      'Lenços e Echarpes',
      'Bijuterias',
      'Óculos de Sol',
      'Chapéus e Bonés',
      'Relógios'
    ],
    acessoriosMasculino: [
      'Carteiras',
      'Cintos',
      'Relógios',
      'Óculos de Sol',
      'Bonés',
      'Mochilas',
      'Gravatas'
    ],
    acessoriosInfantil: [
      'Mochilas',
      'Bolsas Infantis',
      'Tiaras e Laços',
      'Bonés e Chapéus',
      'Relógios Infantis',
      'Acessórios de Cabelo'
    ]
  },
  tendencias2026: [
    'Moda sustentável e consciente',
    'Conforto sem abrir mão do estilo',
    'Cores vibrantes e estampas ousadas',
    'Athleisure para toda família',
    'Minimalismo elegante',
    'Peças versáteis dia-noite',
    'Looks coordenados família',
    'Tecidos tecnológicos',
    'Moda inclusiva (plus size)',
    'Vintage e retrô moderno'
  ],
  publicosAlvo: {
    maesFamilia: 'Mães que compram para toda família: praticidade, qualidade, preço justo, looks coordenados',
    jovensFeminino: 'Mulheres 18-35: tendências, Instagram/TikTok, peças statement, versatilidade',
    jovensMasculino: 'Homens 18-35: praticidade, estilo casual, qualidade, custo-benefício',
    executivos: 'Profissionais 30-50: elegância, qualidade premium, peças clássicas',
    avosBabies: 'Avós que presenteiam netos: fofura, qualidade, conforto para bebês',
    revendedoras: 'Revendedoras/Lojistas: preço de atacado, variedade, novidades constantes'
  },
  estilos: [
    'Casual Chic',
    'Elegante/Social',
    'Esportivo/Comfort',
    'Romântico',
    'Moderno/Trend',
    'Clássico',
    'Street Style',
    'Minimalista',
    'Boho',
    'Fashion Mãe e Filha(o)'
  ],
  temporadas: [
    'Primavera/Verão',
    'Outono/Inverno',
    'Alto Verão',
    'Festas/Fim de Ano',
    'Volta às Aulas',
    'Dia das Mães',
    'Dia dos Pais',
    'Dia das Crianças',
    'Black Friday'
  ],
  terminologias: {
    'lookdodia': 'Inspiração de outfit completo',
    'tal mae tal filha': 'Looks coordenados mãe e filha',
    'familia fashion': 'Looks combinando para toda família',
    'atacado': 'Compra em grande quantidade com desconto',
    'varejo': 'Venda unitária ao consumidor final',
    'pronta entrega': 'Peças disponíveis para envio imediato',
    'lançamento': 'Novidades recém chegadas',
    'queima de estoque': 'Promoção para renovar coleção',
    'tamanhos disponíveis': 'Grade de numeração em estoque'
  },
  faixasPreco: {
    economico: 'Até R$ 50 - Acessível para todos',
    intermediario: 'R$ 50-150 - Qualidade com preço justo',
    premium: 'R$ 150-300 - Alta qualidade e acabamento',
    luxo: 'Acima de R$ 300 - Exclusividade e sofisticação'
  }
};

// Limites de caracteres por plataforma
export const PLATFORM_LIMITS: Record<string, PlatformLimits> = {
  instagram: {
    titulo: { max: 0, recomendado: 0 },
    descricao: { max: 2200, recomendado: 150 },
    hashtags: { max: 30, recomendado: 20 },
    formatoImagem: '1:1 (1080x1080) ou 4:5 (1080x1350)',
    formatoVideo: '9:16 (1080x1920) para Reels',
    duracaoVideo: '15-90 segundos (Reels)',
    dicas: [
      'Primeira linha com gancho forte (visível no feed)',
      'Use emojis estrategicamente 👗👠✨',
      'CTA: "Chama no direct" ou "Link na bio"',
      'Hashtags: #modafeminina #lookdodia #atacadoevarejo',
      'Marque produtos com Shopping Tags'
    ]
  },
  tiktok: {
    titulo: { max: 0, recomendado: 0 },
    descricao: { max: 2200, recomendado: 150 },
    hashtags: { max: 100, recomendado: 5 },
    formatoImagem: '9:16',
    formatoVideo: '9:16 (1080x1920)',
    duracaoVideo: '15-60 segundos ideal',
    dicas: [
      'Gancho nos primeiros 3 segundos: "Gente, olha essa peça!"',
      'Use sons trending de moda',
      'Hashtags: #tiktokfashion #outfit #modabrasileira',
      'Mostrar preço gera curiosidade',
      'Provador/espelho vende muito'
    ]
  },
  youtube: {
    titulo: { max: 100, recomendado: 60 },
    descricao: { max: 5000, recomendado: 300 },
    hashtags: { max: 60, recomendado: 15 },
    formatoImagem: '16:9 (1280x720 thumbnail)',
    formatoVideo: '16:9 (1920x1080) ou 9:16 (Shorts)',
    duracaoVideo: 'Shorts: até 60s | Vídeos: 8-15 min',
    dicas: [
      'Título: RECEBIDOS DO ATACADO + tipo de roupa',
      'Thumbnail com produto + preço',
      'Links de compra nos primeiros 150 chars',
      'Hauls de atacado performam muito bem',
      'Mostrar etiquetas e qualidade'
    ]
  },
  facebook: {
    titulo: { max: 0, recomendado: 0 },
    descricao: { max: 63206, recomendado: 80 },
    hashtags: { max: 30, recomendado: 3 },
    formatoImagem: '1200x630 (link) ou 1:1 (post)',
    formatoVideo: '16:9 ou 9:16',
    duracaoVideo: '1-3 minutos ideal',
    dicas: [
      'Posts curtos convertem mais',
      'Grupos de moda feminina são ouro',
      'Lives de vendas funcionam muito',
      'Facebook Marketplace para alcance local',
      'Catálogo integrado com loja'
    ]
  },
  whatsapp: {
    titulo: { max: 0, recomendado: 0 },
    descricao: { max: 65536, recomendado: 300 },
    hashtags: { max: 0, recomendado: 0 },
    formatoImagem: 'Qualquer, comprimido automaticamente',
    formatoVideo: 'MP4, até 16MB',
    duracaoVideo: 'Até 90 segundos (Status)',
    dicas: [
      'Catálogo WhatsApp Business atualizado',
      'Status com novidades diárias',
      'Mensagem direta: peça + preço + tamanhos',
      'Áudios curtos são pessoais e vendem',
      'Emojis 👗👠👜 aumentam conversão',
      'Listas de transmissão para lançamentos'
    ]
  },
  telegram: {
    titulo: { max: 0, recomendado: 0 },
    descricao: { max: 4096, recomendado: 500 },
    hashtags: { max: 0, recomendado: 5 },
    formatoImagem: 'Qualquer',
    formatoVideo: 'Até 2GB',
    duracaoVideo: 'Sem limite',
    dicas: [
      'Canal VIP para clientes especiais',
      'Promoções exclusivas no canal',
      'Alertas de novidades e reposições',
      'Enquetes: qual peça vocês querem?',
      'Cupons exclusivos para membros'
    ]
  },
  linkedin: {
    titulo: { max: 0, recomendado: 0 },
    descricao: { max: 3000, recomendado: 1300 },
    hashtags: { max: 30, recomendado: 5 },
    formatoImagem: '1200x627 (landscape)',
    formatoVideo: '16:9',
    duracaoVideo: '1-2 minutos',
    dicas: [
      'Foco em empreendedorismo de moda',
      'História do negócio atacado-varejo',
      'Cases de sucesso de revendedoras',
      'Bastidores da compra no atacado',
      'Dicas para quem quer revender'
    ]
  }
};

// Gerar prompt de moda especializado atacado-varejo
export function generateFashionPrompt(platform: string, storeName: string, storeInfo?: string): string {
  const limits = PLATFORM_LIMITS[platform];
  const model = FASHION_KNOWLEDGE.modeloNegocio;
  
  const basePrompt = `Você é um ESPECIALISTA EM MODA E VENDAS para ${storeName}.

🏪 MODELO DE NEGÓCIO:
- ${model.tipo}: ${model.descricao}
- Diferenciais: ${model.diferenciais.join(' | ')}

👗 CATEGORIAS QUE TRABALHAMOS:
FEMININO: ${FASHION_KNOWLEDGE.subcategorias.feminino.join(', ')}
MASCULINO: ${FASHION_KNOWLEDGE.subcategorias.masculino.join(', ')}
INFANTIL: ${FASHION_KNOWLEDGE.subcategorias.infantil.join(', ')}
ACESSÓRIOS FEM: ${FASHION_KNOWLEDGE.subcategorias.acessoriosFeminino.join(', ')}
ACESSÓRIOS MASC: ${FASHION_KNOWLEDGE.subcategorias.acessoriosMasculino.join(', ')}
ACESSÓRIOS INF: ${FASHION_KNOWLEDGE.subcategorias.acessoriosInfantil.join(', ')}

🎯 PÚBLICOS-ALVO:
${Object.entries(FASHION_KNOWLEDGE.publicosAlvo).map(([key, value]) => `- ${value}`).join('\n')}

📱 ESPECIFICAÇÕES ${platform.toUpperCase()}:
${limits ? `
- Descrição: Máximo ${limits.descricao.max} caracteres (ideal: ${limits.descricao.recomendado})
${limits.titulo.max > 0 ? `- Título: Máximo ${limits.titulo.max} caracteres (ideal: ${limits.titulo.recomendado})` : ''}
- Hashtags: ${limits.hashtags.recomendado} hashtags recomendadas
- Imagem: ${limits.formatoImagem}
- Vídeo: ${limits.formatoVideo} | Duração: ${limits.duracaoVideo}

✅ DICAS ${platform.toUpperCase()}:
${limits.dicas.map((d, i) => `${i + 1}. ${d}`).join('\n')}
` : ''}

💰 ABORDAGEM DE VENDAS:
- Sempre mencione: tamanhos disponíveis, cores, preço
- Destaque: qualidade, preço de atacado, pronta entrega
- Use urgência: últimas peças, novidade, tendência
- CTA claro: como comprar, onde chamar

🌟 TENDÊNCIAS 2026:
${FASHION_KNOWLEDGE.tendencias2026.join(' | ')}

📅 TEMPORADAS IMPORTANTES:
${FASHION_KNOWLEDGE.temporadas.join(' | ')}

${storeInfo ? `\n📋 INFO DA LOJA:\n${storeInfo}` : ''}`;

  return basePrompt;
}

// Estrutura de conteúdo gerado
export interface GeneratedFashionContent {
  platform: string;
  titulo?: string;
  descricao: string;
  hashtags: string[];
  cta: string;
  emojis: string[];
  tamanhos?: string;
  preco?: string;
  cores?: string;
  categoria?: 'feminino' | 'masculino' | 'infantil' | 'acessorios';
  characterCount: {
    titulo?: number;
    descricao: number;
    total: number;
  };
  sugestoes: string[];
}
