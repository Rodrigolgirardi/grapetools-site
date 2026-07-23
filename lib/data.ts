// AUTO-GENERATED — não editar manualmente.
// Fonte: grape-skus-2026-06-02.json · Markup: 2.8x · Agrupado por prefixo de SKU

export type Tier = {
  minQty: number;
  label: string;
  price: number;
};

export type KitComponente = { sku: string; quantidade: number };

export type Variation = {
  sku: string;
  label: string;
  tiers: Tier[];
  weight: string;
  ncm: string;
  // Se presente, esta variação é um KIT: composta por outros SKUs.
  // O estoque é calculado dos componentes e a venda dá baixa neles.
  composicao?: KitComponente[];
};

export type Product = {
  prefix: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  brand: string;
  supplier: string;
  keywords: string[];
  variations: Variation[];
  stock: number;
  sold: number;
  isPromotion: boolean;
  isLaunch: boolean;
  // Ficha técnica adicional (opcional — preencha por produto)
  tamanho?: string;
  material?: string;
  usoIndicado?: string;
  compativelCom?: string;
  // Descrição longa personalizada (opcional). Se preenchida, aparece na página
  // do produto no lugar do texto automático. Pode ter quebras de linha.
  descricaoLonga?: string;
};

export const products: Product[] = [
  {
    prefix:"CH.CONEC.DUP",
    slug:"ch-conec-dup",
    name:"Conector Duplo Curto | Grape Tools",
    description:"Conector Duplo Curto · Emendas · Grape Tools",
    category:"Elétrica",
    subcategory:"Conectores",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["conector duplo curto","emendas","grape tools","transparente"],
    variations:[
      {sku:"CH.CONEC.DUP.TS",label:"Transparente",tiers:[{minQty:1,label:"1",price:1.39}, {minQty:30,label:"30",price:1.19}, {minQty:100,label:"100",price:1.09}, {minQty:300,label:"300",price:0.99}],weight:"3g",ncm:"85369090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.CONEC.LONG",
    slug:"ch-conec-long",
    name:"Conector Duplo Longo | Até 4mm | Grape Tools",
    description:"Conector Duplo Longo · Até 4mm · Emendas · Grape Tools",
    category:"Elétrica",
    subcategory:"Conectores",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["conector duplo longo","até 4mm","4mm","emendas","grape tools","transparente","cinza"],
    variations:[
      {sku:"CH.CONEC.LONG.TS",label:"Transparente",tiers:[{minQty:1,label:"1",price:2.29}, {minQty:30,label:"30",price:1.99}, {minQty:100,label:"100",price:1.59}, {minQty:300,label:"300",price:1.39}],weight:"A consultar",ncm:"85369090"},
      {sku:"CH.CONEC.DUP.CZ",label:"Cinza",tiers:[{minQty:1,label:"1",price:2.29}, {minQty:30,label:"30",price:1.99}, {minQty:100,label:"100",price:1.59}, {minQty:300,label:"300",price:1.39}],weight:"7g",ncm:"85369090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.DISC.125.BR",
    slug:"ch-disc-125-br",
    name:"Disco de Lixa Pluma Branco | 125mm | Grape Tools",
    description:"Disco de Lixa · Pluma · Branco · Grape Tools · Grão 40",
    category:"Abrasivos",
    subcategory:"Discos de Lixa",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["disco de lixa","pluma","branco","grape tools","grão 40","grão 60","grão 80","grão 100","grão 120","grão 600"],
    variations:[
      {sku:"CH.DISC.125.BR.40",label:"Branco · Grão 40",tiers:[{minQty:1,label:"1",price:1.59}, {minQty:30,label:"30",price:1.29}, {minQty:100,label:"100",price:0.99}, {minQty:500,label:"500",price:0.89}],weight:"8g",ncm:"68053090"},
      {sku:"CH.DISC.125.BR.60",label:"Branco · Grão 60",tiers:[{minQty:1,label:"1",price:1.59}, {minQty:30,label:"30",price:1.29}, {minQty:100,label:"100",price:0.99}, {minQty:500,label:"500",price:0.89}],weight:"8.00g",ncm:"68053090"},
      {sku:"CH.DISC.125.BR.80",label:"Branco · Grão 80",tiers:[{minQty:1,label:"1",price:1.59}, {minQty:30,label:"30",price:1.29}, {minQty:100,label:"100",price:0.99}, {minQty:500,label:"500",price:0.89}],weight:"8.00g",ncm:"68053090"},
      {sku:"CH.DISC.125.BR.100",label:"Branco · Grão 100",tiers:[{minQty:1,label:"1",price:1.59}, {minQty:30,label:"30",price:1.29}, {minQty:100,label:"100",price:0.99}, {minQty:500,label:"500",price:0.89}],weight:"8.00g",ncm:"68053090"},
      {sku:"CH.DISC.125.BR.120",label:"Branco · Grão 120",tiers:[{minQty:1,label:"1",price:1.59}, {minQty:30,label:"30",price:1.29}, {minQty:100,label:"100",price:0.99}, {minQty:500,label:"500",price:0.89}],weight:"8.00g",ncm:"68053090"},
      {sku:"CH.DISC.125.BR.600",label:"Branco · Grão 600",tiers:[{minQty:1,label:"1",price:1.59}, {minQty:30,label:"30",price:1.29}, {minQty:100,label:"100",price:0.99}, {minQty:500,label:"500",price:0.89}],weight:"8.00g",ncm:"68053090"},
      {sku:"CH.DISC.125.BR.1000",label:"Branco · Grão 1000",tiers:[{minQty:1,label:"1",price:1.59}, {minQty:30,label:"30",price:1.29}, {minQty:100,label:"100",price:0.99}, {minQty:500,label:"500",price:0.89}],weight:"8.00g",ncm:"85444200"},
      {sku:"CH.DISC.125.BR.400",label:"Branco · Grão 400",tiers:[{minQty:1,label:"1",price:1.59}, {minQty:30,label:"30",price:1.29}, {minQty:100,label:"100",price:0.99}, {minQty:500,label:"500",price:0.89}],weight:"8g",ncm:"68053090"},
      {sku:"CH.DISC.125.BR.150",label:"Branco · Grão 150",tiers:[{minQty:1,label:"1",price:1.59}, {minQty:30,label:"30",price:1.29}, {minQty:100,label:"100",price:0.99}, {minQty:500,label:"500",price:0.89}],weight:"8.00g",ncm:"68053090"},
      {sku:"CH.DISC.125.BR.180",label:"Branco · Grão 180",tiers:[{minQty:1,label:"1",price:1.59}, {minQty:30,label:"30",price:1.29}, {minQty:100,label:"100",price:0.99}, {minQty:500,label:"500",price:0.89}],weight:"8.00g",ncm:"68053090"},
      {sku:"CH.DISC.125.BR.240",label:"Branco · Grão 240",tiers:[{minQty:1,label:"1",price:1.59}, {minQty:30,label:"30",price:1.29}, {minQty:100,label:"100",price:0.99}, {minQty:500,label:"500",price:0.89}],weight:"8.00g",ncm:"85444200"},
      {sku:"CH.DISC.125.BR.320",label:"Branco · Grão 320",tiers:[{minQty:1,label:"1",price:1.59}, {minQty:30,label:"30",price:1.29}, {minQty:100,label:"100",price:0.99}, {minQty:500,label:"500",price:0.89}],weight:"8.00g",ncm:"68053090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
    descricaoLonga:`Resumo rápido dos grãos de lixa para disco pluma:

Grão 40 → Desbaste pesado. Remove material rapidamente, tinta grossa, ferrugem e imperfeições grandes.
Grão 60 → Desbaste médio. Nivelamento inicial de superfícies e remoção de marcas profundas.
Grão 80 → Preparação antes do acabamento. Remove riscos deixados pelos grãos mais grossos.
Grão 100 → Acabamento inicial. Começa a deixar a superfície mais uniforme.
Grão 120 → Acabamento intermediário. Muito usado antes da pintura ou aplicação de verniz.
Grão 150 → Refinamento da superfície. Remove riscos leves e melhora o acabamento.
Grão 180 → Pré-acabamento fino. Ideal para preparação de pintura de qualidade.
Grão 240 → Acabamento fino. Deixa a superfície lisa e pronta para pintura fina.
Grão 320 → Acabamento muito fino. Lixamento entre demãos de tinta, verniz ou seladora.
Grão 400 → Polimento inicial. Remove pequenas imperfeições e marcas superficiais.
Grão 600 → Acabamento extrafino. Muito usado em pintura automotiva e lixamento úmido.
Grão 1000 → Polimento fino. Preparação para lustro e acabamento de alto brilho.

Regra simples: quanto menor o número do grão, mais agressiva é a lixa; quanto maior o número, mais fino e suave é o acabamento.`,
  },
  {
    prefix:"CH.DISC.LIX.125",
    slug:"ch-disc-lix-125",
    name:"Disco de Lixa Velcro Vermelho | 125mm | Grape Tools",
    description:"Disco de Lixa Velcro Vermelho · 125mm · Com Furos · Grape Tools",
    category:"Abrasivos",
    subcategory:"Discos com Furos",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["disco de lixa velcro vermelho","disco de lixa com furos","velcro","vermelho","125mm","grão 150","grão 180","grão 40","grão 120","grão 400","grão 60","grão 80","grão 100"],
    variations:[
      {sku:"CH.DISC.LIX.125.150",label:"125mm · Grão 150",tiers:[{minQty:1,label:"1",price:1.39}, {minQty:30,label:"30",price:1.09}, {minQty:100,label:"100",price:0.99}, {minQty:500,label:"500",price:0.79}],weight:"6.00g",ncm:"68053090"},
      {sku:"CH.DISC.LIX.125.180",label:"125mm · Grão 180",tiers:[{minQty:1,label:"1",price:1.39}, {minQty:30,label:"30",price:1.09}, {minQty:100,label:"100",price:0.99}, {minQty:500,label:"500",price:0.79}],weight:"6.00g",ncm:"68053090"},
      {sku:"CH.DISC.LIX.125.40",label:"125mm · Grão 40",tiers:[{minQty:1,label:"1",price:1.39}, {minQty:30,label:"30",price:1.09}, {minQty:100,label:"100",price:0.99}, {minQty:500,label:"500",price:0.79}],weight:"6.00g",ncm:"68053090"},
      {sku:"CH.DISC.LIX.125.120",label:"125mm · Grão 120",tiers:[{minQty:1,label:"1",price:1.39}, {minQty:30,label:"30",price:1.09}, {minQty:100,label:"100",price:0.99}, {minQty:500,label:"500",price:0.79}],weight:"6.00g",ncm:"68053090"},
      {sku:"CH.DISC.LIX.125.400",label:"125mm · Grão 400",tiers:[{minQty:1,label:"1",price:1.39}, {minQty:30,label:"30",price:1.09}, {minQty:100,label:"100",price:0.99}, {minQty:500,label:"500",price:0.79}],weight:"6.00g",ncm:"68053090"},
      {sku:"CH.DISC.LIX.125.60",label:"125mm · Grão 60",tiers:[{minQty:1,label:"1",price:1.39}, {minQty:30,label:"30",price:1.09}, {minQty:100,label:"100",price:0.99}, {minQty:500,label:"500",price:0.79}],weight:"6.00g",ncm:"68053090"},
      {sku:"CH.DISC.LIX.125.80",label:"125mm · Grão 80",tiers:[{minQty:1,label:"1",price:1.39}, {minQty:30,label:"30",price:1.09}, {minQty:100,label:"100",price:0.99}, {minQty:500,label:"500",price:0.79}],weight:"6.00g",ncm:"68053090"},
      {sku:"CH.DISC.LIX.125.100",label:"125mm · Grão 100",tiers:[{minQty:1,label:"1",price:1.39}, {minQty:30,label:"30",price:1.09}, {minQty:100,label:"100",price:0.99}, {minQty:500,label:"500",price:0.79}],weight:"6.00g",ncm:"68053090"},
      {sku:"CH.DISC.LIX.125.240",label:"125mm · Grão 240",tiers:[{minQty:1,label:"1",price:1.39}, {minQty:30,label:"30",price:1.09}, {minQty:100,label:"100",price:0.99}, {minQty:500,label:"500",price:0.79}],weight:"6.00g",ncm:"68053090"},
      {sku:"CH.DISC.LIX.125.320",label:"125mm · Grão 320",tiers:[{minQty:1,label:"1",price:1.39}, {minQty:30,label:"30",price:1.09}, {minQty:100,label:"100",price:0.99}, {minQty:500,label:"500",price:0.79}],weight:"6.00g",ncm:"68053090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.TRAV.PIS",
    slug:"ch-trav-pis",
    name:"Trava Plástica com Pistão | Grape Tools",
    description:"Trava Plástica com Pistão · Grape Tools · Branco",
    category:"Ferragens",
    subcategory:"Travas",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["trava plástica com pistão","grape tools","branco","preto"],
    variations:[
      {sku:"CH.TRAV.PIS.BR",label:"Branco",tiers:[{minQty:1,label:"1",price:2.39}, {minQty:20,label:"20",price:1.59}, {minQty:50,label:"50",price:1.39}, {minQty:100,label:"100",price:1.19}],weight:"0.00g",ncm:"83014000"},
      {sku:"CH.TRAV.PIS.PT",label:"Preto",tiers:[{minQty:1,label:"1",price:2.39}, {minQty:20,label:"20",price:1.59}, {minQty:50,label:"50",price:1.39}, {minQty:100,label:"100",price:1.19}],weight:"0.00g",ncm:"83014000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.LA",
    slug:"ch-la",
    name:"Lâmina de Estilete | Grape Tools",
    description:"Lâmina de Estilete · 18mm · Grape Tools · 0,5mm Espessura (10un)",
    category:"Ferramentas",
    subcategory:"Lâminas",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["lâmina de estilete","18mm","grape tools","0,5mm espessura (10un)","25mm","0,7mm espessura (10un)"],
    variations:[
      {sku:"CH.LA.18",label:"18mm · 0,5mm Espessura (10un)",tiers:[{minQty:1,label:"1",price:3.99}, {minQty:30,label:"30",price:2.99}, {minQty:100,label:"100",price:2.69}, {minQty:200,label:"200",price:2.39}],weight:"0.00g",ncm:"82119400"},
      {sku:"CH.LA.25",label:"25mm · 0,7mm Espessura (10un)",tiers:[{minQty:1,label:"1",price:13.99}, {minQty:30,label:"30",price:11.99}, {minQty:100,label:"100",price:9.99}, {minQty:200,label:"200",price:8.99}],weight:"0.00g",ncm:"82119400"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.SUP.QUAD.5",
    slug:"ch-sup-quad-5",
    name:"Suporte para Esponja | Grape Tools",
    description:"Suporte para Esponja · 5 x 5 · Grape Tools · Aço Escovado",
    category:"Ferramentas",
    subcategory:"Suportes",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["suporte para esponja","5 x 5","grape tools","aço escovado"],
    variations:[
      {sku:"CH.SUP.QUAD.5.5",label:"5 x 5 · Aço Escovado",tiers:[{minQty:1,label:"1",price:4.99}, {minQty:20,label:"20",price:3.99}, {minQty:50,label:"50",price:2.99}, {minQty:100,label:"100",price:2.39}],weight:"0.00g",ncm:"73239300"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.MAC.MAC",
    slug:"ch-mac-mac",
    name:"Fio Macho para Macho | Grape Tools",
    description:"Fio Macho para Macho · Grape Tools · 20cm",
    category:"Elétrica",
    subcategory:"Cabos e Fios",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["fio macho para macho","grape tools","20cm"],
    variations:[
      {sku:"CH.MAC.MAC.20",label:"20cm",tiers:[{minQty:1,label:"1",price:6.49}, {minQty:10,label:"10",price:5.49}, {minQty:30,label:"30",price:4.99}, {minQty:50,label:"50",price:4.49}],weight:"0.00g",ncm:"85444200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.ROLET",
    slug:"ch-rolet",
    name:"Fecho Rolete | Grape Tools",
    description:"Fecho Rolete · Grape Tools · Dourado",
    category:"Ferragens",
    subcategory:"Fechos",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["fecho rolete","grape tools","dourado","zincado"],
    variations:[
      {sku:"CH.ROLET.DO",label:"Dourado",tiers:[{minQty:1,label:"1",price:2.49}, {minQty:50,label:"50",price:1.79}, {minQty:100,label:"100",price:1.39}, {minQty:500,label:"500",price:1.19}],weight:"14g",ncm:"83013000"},
      {sku:"CH.ROLET.PR",label:"Zincado",tiers:[{minQty:1,label:"1",price:2.49}, {minQty:50,label:"50",price:1.79}, {minQty:100,label:"100",price:1.39}, {minQty:500,label:"500",price:1.19}],weight:"14g",ncm:"83013000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.MASC",
    slug:"ch-masc",
    name:"Mascara 3d para Olhos | Grape Tools",
    description:"Mascara 3d para Olhos · Grape Tools · Preto",
    category:"Utilidades",
    subcategory:"Organização",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["mascara 3d para olhos","grape tools","preto"],
    variations:[
      {sku:"CH.MASC.PT",label:"Preto",tiers:[{minQty:1,label:"1",price:27.99}, {minQty:5,label:"5",price:25.99}, {minQty:10,label:"10",price:23.99}, {minQty:30,label:"30",price:22.99}],weight:"35.00g",ncm:"CH.MASC.PT"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.MAC.FEM",
    slug:"ch-mac-fem",
    name:"Fio Macho para Fêmea | Grape Tools",
    description:"Fio Macho para Fêmea · Grape Tools · 20cm",
    category:"Elétrica",
    subcategory:"Cabos e Fios",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["fio macho para fêmea","grape tools","20cm"],
    variations:[
      {sku:"CH.MAC.FEM.20",label:"20cm",tiers:[{minQty:1,label:"1",price:6.49}, {minQty:10,label:"10",price:5.49}, {minQty:30,label:"30",price:4.99}, {minQty:50,label:"50",price:4.49}],weight:"0.00g",ncm:"85444200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.FEM.FEM",
    slug:"ch-fem-fem",
    name:"Fio Fêmea para fêmea | Grape Tools",
    description:"Fio Fêmea para fêmea · Grape Tools · 20cm",
    category:"Elétrica",
    subcategory:"Cabos e Fios",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["fio fêmea para fêmea","grape tools","20cm"],
    variations:[
      {sku:"CH.FEM.FEM.20",label:"20cm",tiers:[{minQty:1,label:"1",price:6.49}, {minQty:10,label:"10",price:5.49}, {minQty:30,label:"30",price:4.99}, {minQty:50,label:"50",price:4.49}],weight:"0.00g",ncm:"85369090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.SUP.INX.VASS",
    slug:"ch-sup-inx-vass",
    name:"Suporte de Vassoura Aço Inox 48,5cm | Grape Tools",
    description:"Suporte de Vassoura · Inox · Grape Tools · 4 Clipes + 5 Ganchos",
    category:"Ferramentas",
    subcategory:"Suportes",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["suporte de vassoura","inox","grape tools","4 clipes + 5 ganchos"],
    variations:[
      {sku:"CH.SUP.INX.VASS.5GAN",label:"Inox · 4 Clipes + 5 Ganchos",tiers:[{minQty:1,label:"1",price:46.99}, {minQty:3,label:"3",price:43.99}, {minQty:5,label:"5",price:39.99}, {minQty:10,label:"10",price:37.99}],weight:"300.00g",ncm:"73181300"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.TRAV.PR",
    slug:"ch-trav-pr",
    name:"Trava Porta Longo Reforçado até 80kg | Grape Tools",
    description:"Trava Porta · Longo · Grape Tools · Prateado",
    category:"Ferragens",
    subcategory:"Travas",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["trava porta","longo","grape tools","prateado"],
    variations:[
      {sku:"CH.TRAV.PR.LONG",label:"Longo · Prateado",tiers:[{minQty:1,label:"1",price:24.99}, {minQty:5,label:"5",price:22.99}, {minQty:10,label:"10",price:20.99}, {minQty:20,label:"20",price:19.99}],weight:"160g",ncm:"83013000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.TPOR",
    slug:"ch-tpor",
    name:"Trava Porta Magnético | Grape Tools",
    description:"Trava Porta Magnético · Grape Tools |Slim",
    category:"Ferragens",
    subcategory:"Travas",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["trava porta magnético","grape tools |slim"],
    variations:[
      {sku:"CH.TPOR.SLIM",label:"Grape Tools |Slim",tiers:[{minQty:1,label:"1",price:19.99}, {minQty:5,label:"5",price:18.99}, {minQty:10,label:"10",price:17.99}, {minQty:20,label:"20",price:16.99}],weight:"80g",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.TRAV.BOL",
    slug:"ch-trav-bol",
    name:"Trava Porta Magnético Bola | Grape Tools",
    description:"Trava Porta Magnético Bola · Grape Tools · Preto",
    category:"Ferragens",
    subcategory:"Travas",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["trava porta magnético bola","grape tools","preto"],
    variations:[
      {sku:"CH.TRAV.BOL.PT",label:"Preto",tiers:[{minQty:1,label:"1",price:14.99}, {minQty:5,label:"5",price:13.99}, {minQty:10,label:"10",price:12.99}, {minQty:20,label:"20",price:9.99}],weight:"79g",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.FEC",
    slug:"ch-fec",
    name:"Fecho Magnético Invisível | Grape Tools",
    description:"Fecho Magnético Invisível · Grape Tools · Prata",
    category:"Ferragens",
    subcategory:"Fechos",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["fecho magnético invisível","grape tools","prata"],
    variations:[
      {sku:"CH.FEC.MAGNET",label:"Prata",tiers:[{minQty:1,label:"1",price:2.49}, {minQty:20,label:"20",price:2.29}, {minQty:50,label:"50",price:1.99}, {minQty:100,label:"100",price:1.79}],weight:"A consultar",ncm:"83015000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.LIMIT",
    slug:"ch-limit",
    name:"Limitador de Janela | Grape Tools",
    description:"Limitador de Janela · Grape Tools Trava Amarelo",
    category:"Ferragens",
    subcategory:"Travas",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["limitador de janela","grape tools trava amarelo"],
    variations:[
      {sku:"CH.LIMIT.TRAV",label:"Grape Tools Trava Amarelo",tiers:[{minQty:1,label:"1",price:6.99}, {minQty:10,label:"10",price:6.69}, {minQty:30,label:"30",price:6.39}, {minQty:50,label:"50",price:5.99}],weight:"A consultar",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"1.AÇUC",
    slug:"1-acuc",
    name:"Açucareiro em Acrilico de Mesa com botão Dosador",
    description:"Açucareiro · Prático · Azul",
    category:"Utilidades",
    subcategory:"Organização",
    brand:"Cobrirel",
    supplier:"Cobrirel",
    keywords:["açucareiro","prático","azul","branco","cinza","preto","verde","vermelho","amarelo"],
    variations:[
      {sku:"1.AÇUC.AZ",label:"Prático · Azul",tiers:[{minQty:1,label:"1",price:16.99}, {minQty:3,label:"3",price:15.99}, {minQty:5,label:"5",price:14.99}, {minQty:10,label:"10",price:13.99}],weight:"A consultar",ncm:"39241000"},
      {sku:"1.AÇUC.BR",label:"Prático · Branco",tiers:[{minQty:1,label:"1",price:16.99}, {minQty:3,label:"3",price:15.99}, {minQty:5,label:"5",price:14.99}, {minQty:10,label:"10",price:13.99}],weight:"A consultar",ncm:"39241000"},
      {sku:"1.AÇUC.CZ",label:"Prático · Cinza",tiers:[{minQty:1,label:"1",price:16.99}, {minQty:3,label:"3",price:15.99}, {minQty:5,label:"5",price:14.99}, {minQty:10,label:"10",price:13.99}],weight:"A consultar",ncm:"39241000"},
      {sku:"1.AÇUC.PT",label:"Prático · Preto",tiers:[{minQty:1,label:"1",price:16.99}, {minQty:3,label:"3",price:15.99}, {minQty:5,label:"5",price:14.99}, {minQty:10,label:"10",price:13.99}],weight:"A consultar",ncm:"39241000"},
      {sku:"1.AÇUC.VD",label:"Prático · Verde",tiers:[{minQty:1,label:"1",price:16.99}, {minQty:3,label:"3",price:15.99}, {minQty:5,label:"5",price:14.99}, {minQty:10,label:"10",price:13.99}],weight:"A consultar",ncm:"39241000"},
      {sku:"1.AÇUC.VM",label:"Prático · Vermelho",tiers:[{minQty:1,label:"1",price:16.99}, {minQty:3,label:"3",price:15.99}, {minQty:5,label:"5",price:14.99}, {minQty:10,label:"10",price:13.99}],weight:"A consultar",ncm:"39241000"},
      {sku:"1.AÇUC.AM",label:"Prático · Amarelo",tiers:[{minQty:1,label:"1",price:16.99}, {minQty:3,label:"3",price:15.99}, {minQty:5,label:"5",price:14.99}, {minQty:10,label:"10",price:13.99}],weight:"A consultar",ncm:"39241000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"1.SUP",
    slug:"1-sup",
    name:"Suporte para Vassoura Branco",
    description:"Suporte para Vassoura Branco",
    category:"Ferramentas",
    subcategory:"Suportes",
    brand:"Cobrirel",
    supplier:"Cobrirel",
    keywords:["suporte para vassoura branco"],
    variations:[
      {sku:"1.SUP.VAS",label:"VAS",tiers:[{minQty:1,label:"1",price:9.99}, {minQty:3,label:"3",price:8.99}, {minQty:5,label:"5",price:8.39}, {minQty:10,label:"10",price:7.99}],weight:"A consultar",ncm:"39252000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"1.TPOR",
    slug:"1-tpor",
    name:"Trava Porta Prático Adesivo Segura Fixa Porta e Janela",
    description:"Trava Porta |Prático · Branco",
    category:"Ferragens",
    subcategory:"Travas",
    brand:"Cobrirel",
    supplier:"Cobrirel",
    keywords:["trava porta |prático","branco","cinza","marrom","preto"],
    variations:[
      {sku:"1.TPOR.BR",label:"Branco",tiers:[{minQty:1,label:"1",price:8.39}, {minQty:3,label:"3",price:7.99}, {minQty:5,label:"5",price:7.39}, {minQty:10,label:"10",price:6.99}],weight:"A consultar",ncm:"39252000"},
      {sku:"1.TPOR.CZ",label:"Cinza",tiers:[{minQty:1,label:"1",price:8.39}, {minQty:3,label:"3",price:7.99}, {minQty:5,label:"5",price:7.39}, {minQty:10,label:"10",price:6.99}],weight:"A consultar",ncm:"39252000"},
      {sku:"1.TPOR.MR",label:"Marrom",tiers:[{minQty:1,label:"1",price:8.39}, {minQty:3,label:"3",price:7.99}, {minQty:5,label:"5",price:7.39}, {minQty:10,label:"10",price:6.99}],weight:"A consultar",ncm:"39252000"},
      {sku:"1.TPOR.PT",label:"Preto",tiers:[{minQty:1,label:"1",price:8.39}, {minQty:3,label:"3",price:7.99}, {minQty:5,label:"5",price:7.39}, {minQty:10,label:"10",price:6.99}],weight:"A consultar",ncm:"39252000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"1.ROD.PIN",
    slug:"1-rod-pin",
    name:"Rodízio Multiuso com Bucha | Suporta até 25kg",
    description:"Rodízio multiuso com bucha · suporta até 25kg · 30mm e 38mm · preto e branco",
    category:"Ferragens",
    subcategory:"Rodízios",
    brand:"Cobrirel",
    supplier:"Cobrirel",
    keywords:["rodízio","multiuso","com bucha","25kg","30mm","38mm","preto","branco"],
    variations:[
      {sku:"1.ROD.PIN.30.PT",label:"30mm · Preto",tiers:[{minQty:1,label:"1",price:6.39}, {minQty:30,label:"30",price:5.99}, {minQty:50,label:"50",price:5.79}, {minQty:100,label:"100",price:5.49}],weight:"A consultar",ncm:"83022000"},
      {sku:"1.ROD.PIN.38.PT",label:"38mm · Preto",tiers:[{minQty:1,label:"1",price:7.39}, {minQty:30,label:"30",price:6.99}, {minQty:50,label:"50",price:6.79}, {minQty:100,label:"100",price:6.49}],weight:"A consultar",ncm:"83022000"},
      {sku:"1.ROD.PIN.30.BR",label:"30mm · Branco",tiers:[{minQty:1,label:"1",price:6.39}, {minQty:30,label:"30",price:5.99}, {minQty:50,label:"50",price:5.79}, {minQty:100,label:"100",price:5.49}],weight:"A consultar",ncm:"83022000"},
      {sku:"1.ROD.PIN.38.BR",label:"38mm · Branco",tiers:[{minQty:1,label:"1",price:7.39}, {minQty:30,label:"30",price:6.99}, {minQty:50,label:"50",price:6.79}, {minQty:100,label:"100",price:6.49}],weight:"A consultar",ncm:"83022000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"2.CAD",
    slug:"2-cad",
    name:"Cadeado Linha Standard Dourado | Papaiz",
    description:"Cadeado |Dourado · 20mm",
    category:"Ferragens",
    subcategory:"Cadeados",
    brand:"Papaiz",
    supplier:"Papaiz",
    keywords:["cadeado |dourado","20mm","25mm","30mm","35mm","40mm","45mm","50mm","60mm","70mm"],
    variations:[
      {sku:"2.CAD.20",label:"20mm",tiers:[{minQty:1,label:"1",price:19.99}, {minQty:10,label:"10",price:18.99}, {minQty:50,label:"50",price:17.99}, {minQty:100,label:"100",price:16.99}],weight:"A consultar",ncm:"83011000"},
      {sku:"2.CAD.25",label:"25mm",tiers:[{minQty:1,label:"1",price:21.99}, {minQty:10,label:"10",price:20.99}, {minQty:50,label:"50",price:19.99}, {minQty:100,label:"100",price:18.99}],weight:"A consultar",ncm:"83011000"},
      {sku:"2.CAD.30",label:"30mm",tiers:[{minQty:1,label:"1",price:23.99}, {minQty:10,label:"10",price:22.99}, {minQty:50,label:"50",price:21.99}, {minQty:100,label:"100",price:20.99}],weight:"A consultar",ncm:"83011000"},
      {sku:"2.CAD.35",label:"35mm",tiers:[{minQty:1,label:"1",price:27.99}, {minQty:10,label:"10",price:26.99}, {minQty:50,label:"50",price:25.99}, {minQty:100,label:"100",price:24.99}],weight:"A consultar",ncm:"83011000"},
      {sku:"2.CAD.40",label:"40mm",tiers:[{minQty:1,label:"1",price:31.99}, {minQty:10,label:"10",price:30.99}, {minQty:50,label:"50",price:29.99}, {minQty:100,label:"100",price:28.99}],weight:"A consultar",ncm:"83011000"},
      {sku:"2.CAD.45",label:"45mm",tiers:[{minQty:1,label:"1",price:33.99}, {minQty:10,label:"10",price:32.99}, {minQty:50,label:"50",price:31.99}, {minQty:100,label:"100",price:30.99}],weight:"A consultar",ncm:"83011000"},
      {sku:"2.CAD.50",label:"50mm",tiers:[{minQty:1,label:"1",price:36.99}, {minQty:10,label:"10",price:35.99}, {minQty:50,label:"50",price:34.99}, {minQty:100,label:"100",price:33.99}],weight:"A consultar",ncm:"83011000"},
      {sku:"2.CAD.60",label:"60mm",tiers:[{minQty:1,label:"1",price:49.99}, {minQty:10,label:"10",price:48.99}, {minQty:50,label:"50",price:47.99}, {minQty:100,label:"100",price:46.99}],weight:"A consultar",ncm:"83011000"},
      {sku:"2.CAD.70",label:"70mm",tiers:[{minQty:1,label:"1",price:69.99}, {minQty:10,label:"10",price:68.99}, {minQty:50,label:"50",price:67.99}, {minQty:100,label:"100",price:66.99}],weight:"A consultar",ncm:"83011000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.TPOR.LONG",
    slug:"3-tpor-long",
    name:"Trava Porta Magnético Longo | Renna",
    description:"Trava Porta Magnético Longo | Renna",
    category:"Ferragens",
    subcategory:"Travas",
    brand:"Renna",
    supplier:"Renna",
    keywords:["trava porta magnético","longo","renna","trava porta"],
    variations:[
      {sku:"3.TPOR.LONG",label:"Longo",tiers:[{minQty:1,label:"1",price:22.99}, {minQty:5,label:"5",price:21.99}, {minQty:10,label:"10",price:19.99}, {minQty:20,label:"20",price:18.99}],weight:"A consultar",ncm:"83024100"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.TPOR.SLIM",
    slug:"3-tpor-slim",
    name:"Trava Porta Magnético Slim | Renna",
    description:"Trava Porta Magnético Slim | Renna",
    category:"Ferragens",
    subcategory:"Travas",
    brand:"Renna",
    supplier:"Renna",
    keywords:["trava porta magnético","slim","renna","trava porta"],
    variations:[
      {sku:"3.TPOR.SLIM",label:"Slim",tiers:[{minQty:1,label:"1",price:20.99}, {minQty:5,label:"5",price:19.99}, {minQty:10,label:"10",price:18.99}, {minQty:20,label:"20",price:17.99}],weight:"A consultar",ncm:"83024100"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.TPOR.PISO",
    slug:"3-tpor-piso",
    name:"Trava Porta Magnético Clássico | Renna",
    description:"Trava Porta Magnético Clássico | Renna",
    category:"Ferragens",
    subcategory:"Travas",
    brand:"Renna",
    supplier:"Renna",
    keywords:["trava porta magnético","clássico","piso","renna","trava porta"],
    variations:[
      {sku:"3.TPOR.PISO",label:"Clássico",tiers:[{minQty:1,label:"1",price:13.99}, {minQty:5,label:"5",price:12.99}, {minQty:20,label:"20",price:11.99}, {minQty:50,label:"50",price:10.99}],weight:"A consultar",ncm:"83024100"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.MET",
    slug:"3-met",
    name:"Metro Sueco Articulado de Madeira | 2 Metros",
    description:"Metro Sueco de Madeira",
    category:"Ferramentas",
    subcategory:"Medição",
    brand:"Renna",
    supplier:"Renna",
    keywords:["metro sueco de madeira"],
    variations:[
      {sku:"3.MET.SUECO",label:"SUECO",tiers:[{minQty:1,label:"1",price:32.99}, {minQty:3,label:"3",price:29.99}, {minQty:5,label:"5",price:27.99}, {minQty:10,label:"10",price:25.99}],weight:"A consultar",ncm:"90178010"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.PIS.BR",
    slug:"3-pis-br",
    name:"Pistão a Gás Branco com Amortecedor | Abre a porta para Cima",
    description:"Pistão Fit · 40N · Branco",
    category:"Ferragens",
    subcategory:"Pistões",
    brand:"Renna",
    supplier:"Renna",
    keywords:["pistão fit","40n","branco","60n","80n","100n","120n","150n","180n"],
    variations:[
      {sku:"3.PIS.BR.40",label:"40N · Branco",tiers:[{minQty:1,label:"1",price:6.99}, {minQty:20,label:"20",price:6.49}, {minQty:50,label:"50",price:5.99}, {minQty:100,label:"100",price:4.99}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.PIS.BR.60",label:"60N · Branco",tiers:[{minQty:1,label:"1",price:6.99}, {minQty:20,label:"20",price:6.49}, {minQty:50,label:"50",price:5.99}, {minQty:100,label:"100",price:4.99}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.PIS.BR.80",label:"80N · Branco",tiers:[{minQty:1,label:"1",price:6.99}, {minQty:20,label:"20",price:6.49}, {minQty:50,label:"50",price:5.99}, {minQty:100,label:"100",price:4.99}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.PIS.BR.100",label:"100N · Branco",tiers:[{minQty:1,label:"1",price:6.99}, {minQty:20,label:"20",price:6.49}, {minQty:50,label:"50",price:5.99}, {minQty:100,label:"100",price:4.99}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.PIS.BR.120",label:"120N · Branco",tiers:[{minQty:1,label:"1",price:6.99}, {minQty:20,label:"20",price:6.49}, {minQty:50,label:"50",price:5.99}, {minQty:100,label:"100",price:4.99}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.PIS.BR.150",label:"150N · Branco",tiers:[{minQty:1,label:"1",price:6.99}, {minQty:20,label:"20",price:6.49}, {minQty:50,label:"50",price:5.99}, {minQty:100,label:"100",price:4.99}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.PIS.BR.180",label:"180N · Branco",tiers:[{minQty:1,label:"1",price:6.99}, {minQty:20,label:"20",price:6.49}, {minQty:50,label:"50",price:5.99}, {minQty:100,label:"100",price:4.99}],weight:"A consultar",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.PIS.CZ",
    slug:"3-pis-cz",
    name:"Pistão a Gás Cinza com Amortecedor | Abre a porta para Cima",
    description:"Pistão Fit · 40N · Cinza",
    category:"Ferragens",
    subcategory:"Pistões",
    brand:"Renna",
    supplier:"Renna",
    keywords:["pistão fit","40n","cinza","60n","80n","100n","120n","150n"],
    variations:[
      {sku:"3.PIS.CZ.40",label:"40N · Cinza",tiers:[{minQty:1,label:"1",price:6.99}, {minQty:20,label:"20",price:6.49}, {minQty:50,label:"50",price:5.99}, {minQty:100,label:"100",price:4.99}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.PIS.CZ.60",label:"60N · Cinza",tiers:[{minQty:1,label:"1",price:6.99}, {minQty:20,label:"20",price:6.49}, {minQty:50,label:"50",price:5.99}, {minQty:100,label:"100",price:4.99}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.PIS.CZ.80",label:"80N · Cinza",tiers:[{minQty:1,label:"1",price:6.99}, {minQty:20,label:"20",price:6.49}, {minQty:50,label:"50",price:5.99}, {minQty:100,label:"100",price:4.99}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.PIS.CZ.100",label:"100N · Cinza",tiers:[{minQty:1,label:"1",price:6.99}, {minQty:20,label:"20",price:6.49}, {minQty:50,label:"50",price:5.99}, {minQty:100,label:"100",price:4.99}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.PIS.CZ.120",label:"120N · Cinza",tiers:[{minQty:1,label:"1",price:6.99}, {minQty:20,label:"20",price:6.49}, {minQty:50,label:"50",price:5.99}, {minQty:100,label:"100",price:4.99}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.PIS.CZ.150",label:"150N · Cinza",tiers:[{minQty:1,label:"1",price:6.99}, {minQty:20,label:"20",price:6.49}, {minQty:50,label:"50",price:5.99}, {minQty:100,label:"100",price:4.99}],weight:"A consultar",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.DOB.AMORT",
    slug:"3-dob-amort",
    name:"Dobradiça 35mm com Amortecedor para Móveis",
    description:"Dobradiça 35mm com Amortecedor para Móveis · Curva e Reta",
    category:"Ferragens",
    subcategory:"Dobradiças",
    brand:"Renna",
    supplier:"Renna",
    keywords:["dobradiça","amortecedor","35mm","curva","reta","móveis"],
    variations:[
      {sku:"3.DOB.AMORT.CUR",label:"Curva com Amortecedor 35mm",tiers:[{minQty:1,label:"1",price:2.99}, {minQty:50,label:"50",price:2.59}, {minQty:100,label:"100",price:2.39}, {minQty:200,label:"200",price:2.29}],weight:"A consultar",ncm:"83021000"},
      {sku:"3.DOB.AMORT.RET",label:"Reta com Amortecedor 35mm",tiers:[{minQty:1,label:"1",price:2.99}, {minQty:50,label:"50",price:2.59}, {minQty:100,label:"100",price:2.39}, {minQty:200,label:"200",price:2.29}],weight:"A consultar",ncm:"83021000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.PUX.CONCH",
    slug:"3-pux-conch",
    name:"Puxador Concha Paris para Móveis | 96mm | Aço Escovado",
    description:"Puxador · Paris · 96mm · Aço Escovado",
    category:"Ferragens",
    subcategory:"Puxadores",
    brand:"Renna",
    supplier:"Renna",
    keywords:["puxador","paris","96mm","aço escovado"],
    variations:[
      {sku:"3.PUX.CONCH.AÇOESC",label:"96mm · Aço Escovado",tiers:[{minQty:1,label:"1",price:26.99}, {minQty:20,label:"20",price:25.99}, {minQty:30,label:"30",price:24.99}, {minQty:50,label:"50",price:23.99}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.CORR.LARG",
    slug:"3-corr-larg",
    name:"Corrediça Telescópica Reforçada | H45 (45kg)",
    description:"Corrediça Telescópica · 45mm · 25cm",
    category:"Ferragens",
    subcategory:"Corrediças",
    brand:"Renna",
    supplier:"Renna",
    keywords:["corrediça telescópica","45mm","25cm","30cm","35cm","40cm"],
    variations:[
      {sku:"3.CORR.LARG.25CM",label:"45mm · 25cm",tiers:[{minQty:1,label:"1",price:12.99}, {minQty:30,label:"30",price:11.99}, {minQty:50,label:"50",price:10.99}, {minQty:100,label:"100",price:9.99}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.CORR.LARG.30CM",label:"45mm · 30cm",tiers:[{minQty:1,label:"1",price:14.99}, {minQty:30,label:"30",price:13.99}, {minQty:50,label:"50",price:12.99}, {minQty:100,label:"100",price:12.69}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.CORR.LARG.35CM",label:"45mm · 35cm",tiers:[{minQty:1,label:"1",price:17.99}, {minQty:30,label:"30",price:16.99}, {minQty:50,label:"50",price:15.99}, {minQty:100,label:"100",price:14.99}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.CORR.LARG.40CM",label:"45mm · 40cm",tiers:[{minQty:1,label:"1",price:19.99}, {minQty:50,label:"50",price:18.99}, {minQty:100,label:"100",price:17.99}, {minQty:500,label:"500",price:16.99}],weight:"A consultar",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.PUX.31",
    slug:"3-pux-31",
    name:"Puxador Ponto para Móveis | 31,5mm | Redondo",
    description:"Puxador PUX · Redondo 31,5mm| Cromado",
    category:"Ferragens",
    subcategory:"Puxadores",
    brand:"Renna",
    supplier:"Renna",
    keywords:["puxador pux","redondo 31,5mm| cromado","redondo 31,5mm| dourado","redondo 31,5mm| preto fosco","redondo 31,5mm| escovado"],
    variations:[
      {sku:"3.PUX.31.CRO",label:"Redondo 31,5mm| Cromado",tiers:[{minQty:1,label:"1",price:9.99}, {minQty:50,label:"50",price:9.39}, {minQty:100,label:"100",price:8.99}, {minQty:200,label:"200",price:7.99}],weight:"A consultar",ncm:""},
      {sku:"3.PUX.31.DO",label:"Redondo 31,5mm| Dourado",tiers:[{minQty:1,label:"1",price:9.99}, {minQty:50,label:"50",price:9.39}, {minQty:100,label:"100",price:8.99}, {minQty:200,label:"200",price:7.99}],weight:"A consultar",ncm:""},
      {sku:"3.PUX.31.PT",label:"Redondo 31,5mm| Preto Fosco",tiers:[{minQty:1,label:"1",price:9.99}, {minQty:50,label:"50",price:9.39}, {minQty:100,label:"100",price:8.99}, {minQty:200,label:"200",price:7.99}],weight:"A consultar",ncm:""},
      {sku:"3.PUX.31.ESC",label:"Redondo 31,5mm| Escovado",tiers:[{minQty:1,label:"1",price:9.99}, {minQty:50,label:"50",price:9.39}, {minQty:100,label:"100",price:8.99}, {minQty:200,label:"200",price:7.99}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.SPOT.QUAD",
    slug:"3-spot-quad",
    name:"Spot Led De Embutir Quadrado Cromado 1w 6000k Branco-frio",
    description:"Spot Led De Embutir Quadrado Cromado 1w 6000k Branco-frio",
    category:"Elétrica",
    subcategory:"Iluminação",
    brand:"Renna",
    supplier:"Renna",
    keywords:["spot lumini","quadrado","1w 6000k","cromado"],
    variations:[
      {sku:"3.SPOT.QUAD.CROM",label:"1w 6000k · Cromado",tiers:[{minQty:1,label:"1",price:9.99}, {minQty:50,label:"50",price:9.39}, {minQty:100,label:"100",price:8.99}, {minQty:200,label:"200",price:7.99}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"3.PUX.LONG",
    slug:"3-pux-long",
    name:"Puxador Longo Redondo em Inox Escovado",
    description:"Puxador longo redondo em inox escovado · vários tamanhos, de 96mm (15cm) a 320mm (50cm)",
    category:"Ferragens",
    subcategory:"Puxadores",
    brand:"Renna",
    supplier:"Renna",
    keywords:["puxador","longo","redondo","inox","escovado","haste inox","96mm","128mm","160mm","192mm","224mm","256mm","288mm","320mm"],
    variations:[
      {sku:"3.PUX.LONG.96.AÇOESC",label:"96mm · 15cm",tiers:[{minQty:1,label:"1",price:4.39}, {minQty:10,label:"10",price:3.99}, {minQty:30,label:"30",price:3.69}, {minQty:100,label:"100",price:3.49}],weight:"A consultar",ncm:""},
      {sku:"3.PUX.LONG.128.AÇOESC",label:"128mm · 20cm",tiers:[{minQty:1,label:"1",price:4.99}, {minQty:10,label:"10",price:4.49}, {minQty:30,label:"30",price:4.19}, {minQty:100,label:"100",price:3.99}],weight:"A consultar",ncm:"83024200"},
      {sku:"3.PUX.LONG.160.AÇOESC",label:"160mm · 25cm",tiers:[{minQty:1,label:"1",price:5.69}, {minQty:10,label:"10",price:4.99}, {minQty:30,label:"30",price:4.59}, {minQty:100,label:"100",price:4.39}],weight:"A consultar",ncm:""},
      {sku:"3.PUX.LONG.192.AÇOESC",label:"192mm · 30cm",tiers:[{minQty:1,label:"1",price:6.39}, {minQty:10,label:"10",price:5.99}, {minQty:30,label:"30",price:5.69}, {minQty:100,label:"100",price:5.49}],weight:"A consultar",ncm:""},
      {sku:"3.PUX.LONG.224.AÇOESC",label:"224mm · 35cm",tiers:[{minQty:1,label:"1",price:6.99}, {minQty:10,label:"10",price:6.49}, {minQty:30,label:"30",price:6.19}, {minQty:100,label:"100",price:5.99}],weight:"A consultar",ncm:""},
      {sku:"3.PUX.LONG.256.AÇOESC",label:"256mm · 40cm",tiers:[{minQty:1,label:"1",price:7.69}, {minQty:10,label:"10",price:6.99}, {minQty:30,label:"30",price:6.59}, {minQty:100,label:"100",price:6.39}],weight:"A consultar",ncm:""},
      {sku:"3.PUX.LONG.288.AÇOESC",label:"288mm · 45cm",tiers:[{minQty:1,label:"1",price:8.39}, {minQty:10,label:"10",price:7.99}, {minQty:30,label:"30",price:7.69}, {minQty:100,label:"100",price:7.49}],weight:"A consultar",ncm:""},
      {sku:"3.PUX.LONG.320.AÇOESC",label:"320mm · 50cm",tiers:[{minQty:1,label:"1",price:9.99}, {minQty:10,label:"10",price:9.49}, {minQty:30,label:"30",price:8.99}, {minQty:100,label:"100",price:8.49}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"4.LA",
    slug:"4-la",
    name:"Boina de Lã de Polir | 125mm | Compel",
    description:"Boina de Lã · 125mm (Compel)",
    category:"Abrasivos",
    subcategory:"Discos Especiais",
    brand:"Starfer",
    supplier:"Starfer",
    keywords:["boina de lã","125mm (compel)"],
    variations:[
      {sku:"4.LA.125",label:"125mm (Compel)",tiers:[{minQty:1,label:"1",price:14.99}, {minQty:5,label:"5",price:13.99}, {minQty:10,label:"10",price:12.99}, {minQty:30,label:"30",price:12.69}],weight:"A consultar",ncm:"96039000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"4.M14",
    slug:"4-m14",
    name:"Base Velcro com Pino Rosca M14 | 125mm",
    description:"Base Velcro com Pino Rosca M14 · 125mm",
    category:"Abrasivos",
    subcategory:"Discos de Lixa",
    brand:"Starfer",
    supplier:"Starfer",
    keywords:["disco de lixa","m14","125mm"],
    variations:[
      {sku:"4.M14.125",label:"M14 · 125mm",tiers:[{minQty:1,label:"1",price:15.99}, {minQty:5,label:"5",price:14.99}, {minQty:10,label:"10",price:13.99}, {minQty:30,label:"30",price:13.69}],weight:"A consultar",ncm:"84679200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"4.FEC.VITRIN",
    slug:"4-fec-vitrin",
    name:"Fechadura Para Vitrine",
    description:"Fechadura Para Vitrine · 140mm",
    category:"Ferragens",
    subcategory:"Fechaduras",
    brand:"Starfer",
    supplier:"Starfer",
    keywords:["fechadura para vitrine","140mm"],
    variations:[
      {sku:"4.FEC.VITRIN.140",label:"140mm",tiers:[{minQty:1,label:"1",price:21.99}, {minQty:5,label:"5",price:20.99}, {minQty:10,label:"10",price:19.99}, {minQty:30,label:"30",price:18.99}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"4.DISC.POL",
    slug:"4-disc-pol",
    name:"Disco para Polimento de Vidro",
    description:"Disco para Polimento de Vidro · 5pol",
    category:"Abrasivos",
    subcategory:"Discos Especiais",
    brand:"Starfer",
    supplier:"Starfer",
    keywords:["disco para polimento de vidro","5\""],
    variations:[
      {sku:"4.DISC.POL.5",label:"5\"",tiers:[{minQty:1,label:"1",price:25.99}, {minQty:5,label:"5",price:23.99}, {minQty:10,label:"10",price:21.99}, {minQty:30,label:"30",price:19.99}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"5.BUCHA.C",
    slug:"5-bucha-c",
    name:"Bucha Plástica de Fixação Sem Aba para Concreto",
    description:"Bucha Plástica de Fixação Sem Aba para Concreto · 5mm, 6mm e 8mm · 100 peças ou pacote fechado (1000 pçs)",
    category:"Fixação",
    subcategory:"Buchas",
    brand:"Ivplast",
    supplier:"Ivplast",
    keywords:["bucha plástica","bucha sem aba","concreto","fixação","100 peças","5mm","pacote fechado","6mm","8mm","1000 peças"],
    variations:[
      {sku:"5.BUCHA.C.5",label:"100 Peças - 5mm",tiers:[{minQty:1,label:"1",price:3.69}, {minQty:10,label:"10",price:1.89}, {minQty:30,label:"30",price:1.79}, {minQty:50,label:"50",price:1.59}],weight:"A consultar",ncm:"39259090"},
      {sku:"5.BUCHA.C.6",label:"100 Peças - 6mm",tiers:[{minQty:1,label:"1",price:3.99}, {minQty:10,label:"10",price:1.99}, {minQty:30,label:"30",price:1.89}, {minQty:50,label:"50",price:1.69}],weight:"A consultar",ncm:"39259090"},
      {sku:"5.BUCHA.C.8",label:"100 Peças - 8mm",tiers:[{minQty:1,label:"1",price:4.19}, {minQty:10,label:"10",price:2.99}, {minQty:30,label:"30",price:2.79}, {minQty:50,label:"50",price:2.49}],weight:"A consultar",ncm:"39259090"},
      {sku:"5.BUCHA.C.5_PCT",label:"Pacote Fechado - 5mm (1000pçs)",tiers:[{minQty:1,label:"1",price:19.69}, {minQty:5,label:"5",price:17.69}, {minQty:10,label:"10",price:16.69}, {minQty:30,label:"30",price:15.69}],weight:"A consultar",ncm:"39259090"},
      {sku:"5.BUCHA.C.6_PCT",label:"Pacote Fechado - 6mm (1000pçs)",tiers:[{minQty:1,label:"1",price:19.99}, {minQty:5,label:"5",price:17.99}, {minQty:10,label:"10",price:16.99}, {minQty:30,label:"30",price:15.99}],weight:"A consultar",ncm:"39259090"},
      {sku:"5.BUCHA.C.8_PCT",label:"Pacote Fechado - 8mm (1000pçs)",tiers:[{minQty:1,label:"1",price:31.99}, {minQty:5,label:"5",price:29.99}, {minQty:10,label:"10",price:27.99}, {minQty:30,label:"30",price:24.99}],weight:"A consultar",ncm:"39259090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"5.BUCHA.PER",
    slug:"5-bucha-per",
    name:"Bucha Perfix com Anel para Paredes de Bloco Oco",
    description:"Bucha Perfix com anel para paredes de bloco oco · pacotes de 100 peças · 6mm, 8mm e 10mm",
    category:"Fixação",
    subcategory:"Buchas",
    brand:"Ivplast",
    supplier:"Ivplast",
    keywords:["bucha perfix","100 peças","10mm","pacote","6mm","8mm"],
    variations:[
      {sku:"5.BUCHA.PER.6",label:"100 Peças - 6mm",tiers:[{minQty:1,label:"1",price:7.99}, {minQty:3,label:"3",price:5.99}, {minQty:5,label:"5",price:4.99}, {minQty:10,label:"10",price:4.69}],weight:"A consultar",ncm:"39259090"},
      {sku:"5.BUCHA.PER.8",label:"100 Peças - 8mm",tiers:[{minQty:1,label:"1",price:11.99}, {minQty:3,label:"3",price:10.99}, {minQty:5,label:"5",price:9.99}, {minQty:10,label:"10",price:8.99}],weight:"A consultar",ncm:"39259090"},
      {sku:"5.BUCHA.PER.10",label:"100 Peças - 10mm",tiers:[{minQty:1,label:"1",price:16.99}, {minQty:3,label:"3",price:15.99}, {minQty:5,label:"5",price:14.99}, {minQty:10,label:"10",price:13.99}],weight:"A consultar",ncm:"39259090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"5.BUC.GDP",
    slug:"5-buc-gdp",
    name:"Bucha GDP",
    description:"Bucha GDP · 4mm a 16mm · 250 Pçs",
    category:"Fixação",
    subcategory:"Buchas",
    brand:"Ivplast",
    supplier:"Ivplast",
    keywords:["bucha gdp","4mm a 16mm","250 pçs","100 pçs","15mm a 23mm"],
    variations:[
      {sku:"5.BUC.GDP.4A16_PCT",label:"4mm a 16mm · 250 Pçs",tiers:[{minQty:1,label:"1",price:55.99}, {minQty:5,label:"5",price:49.99}, {minQty:10,label:"10",price:45.99}, {minQty:20,label:"20",price:41.99}],weight:"A consultar",ncm:"39259090"},
      {sku:"5.BUC.GDP.4A16",label:"4mm a 16mm · 100 Pçs",tiers:[{minQty:1,label:"1",price:23.99}, {minQty:5,label:"5",price:21.99}, {minQty:10,label:"10",price:19.99}, {minQty:20,label:"20",price:17.99}],weight:"A consultar",ncm:"39259090"},
      {sku:"5.BUC.GDP.2_PCT",label:"15mm a 23mm · 250 Pçs",tiers:[{minQty:1,label:"1",price:56.99}, {minQty:5,label:"5",price:50.99}, {minQty:10,label:"10",price:46.99}, {minQty:20,label:"20",price:42.99}],weight:"A consultar",ncm:"39259090"},
      {sku:"5.BUC.GDP.2",label:"15mm a 23mm · 100 Pçs",tiers:[{minQty:1,label:"1",price:24.99}, {minQty:5,label:"5",price:22.99}, {minQty:10,label:"10",price:20.99}, {minQty:20,label:"20",price:18.99}],weight:"A consultar",ncm:"39259090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"6.GAN.LV",
    slug:"6-gan-lv",
    name:"Kit Par de Gancho de Rede Aço Reforçado | Com parafusos e buchas",
    description:"Gancho de Rede · Dourado",
    category:"Fixação",
    subcategory:"Ganchos",
    brand:"RCA",
    supplier:"RCA",
    keywords:["gancho de rede","dourado","preto","zincado","branco"],
    variations:[
      {sku:"6.GAN.LV.DO",label:"Dourado",tiers:[{minQty:1,label:"1",price:15.99}, {minQty:3,label:"3",price:13.99}, {minQty:5,label:"5",price:12.99}, {minQty:10,label:"10",price:11.99}],weight:"A consultar",ncm:"73269090"},
      {sku:"6.GAN.LV.PT",label:"Preto",tiers:[{minQty:1,label:"1",price:15.99}, {minQty:3,label:"3",price:13.99}, {minQty:5,label:"5",price:12.99}, {minQty:10,label:"10",price:11.99}],weight:"A consultar",ncm:"73269090"},
      {sku:"6.GAN.LV.ZC",label:"Zincado",tiers:[{minQty:1,label:"1",price:15.99}, {minQty:3,label:"3",price:13.99}, {minQty:5,label:"5",price:12.99}, {minQty:10,label:"10",price:11.99}],weight:"A consultar",ncm:"73269090"},
      {sku:"6.GAN.LV.BR",label:"Branco",tiers:[{minQty:1,label:"1",price:15.99}, {minQty:3,label:"3",price:13.99}, {minQty:5,label:"5",price:12.99}, {minQty:10,label:"10",price:11.99}],weight:"A consultar",ncm:"73269090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"6.MAOF",
    slug:"6-maof",
    name:"Mão Francesa Leve",
    description:"Mão Francesa Leve · Branca e Preta · 20cm a 30cm · RCA",
    category:"Ferragens",
    subcategory:"Mãos Francesas",
    brand:"RCA",
    supplier:"RCA",
    keywords:["mão francesa leve","branca","preta","20cm","25cm","30cm"],
    variations:[
      {sku:"6.MAOF.BR.20",label:"Branca · 20cm",tiers:[{minQty:1,label:"1",price:4.49}, {minQty:12,label:"12",price:3.99}, {minQty:60,label:"60",price:3.69}, {minQty:120,label:"120",price:3.39}],weight:"A consultar",ncm:"72162100"},
      {sku:"6.MAOF.BR.25",label:"Branca · 25cm",tiers:[{minQty:1,label:"1",price:5.49}, {minQty:12,label:"12",price:4.99}, {minQty:60,label:"60",price:4.69}, {minQty:120,label:"120",price:4.29}],weight:"A consultar",ncm:"72162100"},
      {sku:"6.MAOF.BR.30",label:"Branca · 30cm",tiers:[{minQty:1,label:"1",price:6.29}, {minQty:12,label:"12",price:5.69}, {minQty:60,label:"60",price:5.09}, {minQty:120,label:"120",price:4.69}],weight:"A consultar",ncm:"72162100"},
      {sku:"6.MAOF.PT.20",label:"Preta · 20cm",tiers:[{minQty:1,label:"1",price:4.49}, {minQty:12,label:"12",price:3.99}, {minQty:60,label:"60",price:3.69}, {minQty:120,label:"120",price:3.39}],weight:"A consultar",ncm:"72162100"},
      {sku:"6.MAOF.PT.25",label:"Preta · 25cm",tiers:[{minQty:1,label:"1",price:5.49}, {minQty:12,label:"12",price:4.99}, {minQty:60,label:"60",price:4.69}, {minQty:120,label:"120",price:4.29}],weight:"A consultar",ncm:"72162100"},
      {sku:"6.MAOF.PT.30",label:"Preta · 30cm",tiers:[{minQty:1,label:"1",price:6.29}, {minQty:12,label:"12",price:5.69}, {minQty:60,label:"60",price:5.09}, {minQty:120,label:"120",price:4.69}],weight:"A consultar",ncm:"72162100"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"8.MINI",
    slug:"8-mini",
    name:"Mini Balança Digital",
    description:"Mini Balança Digital · Preto · 0,1g até 500g",
    category:"Ferramentas",
    subcategory:"Medição",
    brand:"Utimix",
    supplier:"Utimix",
    keywords:["mini balança digital","preto","0,1g até 500g"],
    variations:[
      {sku:"8.MINI.BAL",label:"Preto · 0,1g até 500g",tiers:[{minQty:1,label:"1",price:27.99}, {minQty:3,label:"3",price:25.99}, {minQty:5,label:"5",price:23.99}, {minQty:10,label:"10",price:21.99}],weight:"A consultar",ncm:"84231000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"8.BAL.BOLS",
    slug:"8-bal-bols",
    name:"Balança de Bolso",
    description:"Balança de Bolso · Prata · 0,1 até 500g",
    category:"Ferramentas",
    subcategory:"Medição",
    brand:"Utimix",
    supplier:"Utimix",
    keywords:["balança de bolso","prata","0,1 até 500g"],
    variations:[
      {sku:"8.BAL.BOLS.PR",label:"Prata · 0,1 até 500g",tiers:[{minQty:1,label:"1",price:27.69}, {minQty:3,label:"3",price:25.69}, {minQty:5,label:"5",price:23.69}, {minQty:10,label:"10",price:21.69}],weight:"A consultar",ncm:"84231000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"8.PORT.PAP",
    slug:"8-port-pap",
    name:"Porta Papel Higiênico em Acrílico | Tampa de Bambu",
    description:"Porta Papel Higiênico · Tampa de Bambu",
    category:"Utilidades",
    subcategory:"Banheiro",
    brand:"Utimix",
    supplier:"Utimix",
    keywords:["porta papel higiênico","tampa de bambu"],
    variations:[
      {sku:"8.PORT.PAP.BAMB",label:"Tampa de Bambu",tiers:[{minQty:1,label:"1",price:26.99}, {minQty:3,label:"3",price:23.99}, {minQty:5,label:"5",price:21.99}, {minQty:10,label:"10",price:19.99}],weight:"A consultar",ncm:"46021100"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"8.PORT.LEN",
    slug:"8-port-len",
    name:"Porta Lenço Retangular",
    description:"Porta Lenço Retangular · Tampa de Bambu",
    category:"Utilidades",
    subcategory:"Banheiro",
    brand:"Utimix",
    supplier:"Utimix",
    keywords:["porta lenço retangular","tampa de bambu"],
    variations:[
      {sku:"8.PORT.LEN.BAMB",label:"Tampa de Bambu",tiers:[{minQty:1,label:"1",price:26.99}, {minQty:3,label:"3",price:23.99}, {minQty:5,label:"5",price:21.99}, {minQty:10,label:"10",price:19.99}],weight:"A consultar",ncm:"46021100"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"9.BOLS.TER",
    slug:"9-bols-ter",
    name:"Bolsa Compressa Térmica Gelo Termogel Reutilizável",
    description:"Bolsa Térmica · Grande 650ml e Pequena 350ml",
    category:"Utilidades",
    subcategory:"Organização",
    brand:"Termogel",
    supplier:"Termogel",
    keywords:["bolsa térmica","compressa","gelo","termogel","reutilizável","grande","650ml","pequena","350ml"],
    variations:[
      {sku:"9.BOLS.TER.GRA",label:"Grande · 650ml",tiers:[{minQty:1,label:"1",price:21.99}, {minQty:5,label:"5",price:19.99}, {minQty:10,label:"10",price:17.99}, {minQty:20,label:"20",price:16.99}],weight:"A consultar",ncm:"39123119"},
      {sku:"9.BOLS.TERM.PEQ",label:"Pequena · 350ml",tiers:[{minQty:1,label:"1",price:11.99}, {minQty:5,label:"5",price:10.99}, {minQty:10,label:"10",price:9.99}, {minQty:20,label:"20",price:8.99}],weight:"A consultar",ncm:"39123119"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"11.ROD.PIN",
    slug:"11-rod-pin",
    name:"Rodizio Anti-Risco SQ65 em Silicone para Cadeira de Escritório | Encaixe Universal",
    description:"Rodízio · SQ65 HGA Preto · Com Capa",
    category:"Ferragens",
    subcategory:"Rodízios",
    brand:"Squadroni",
    supplier:"Squadroni",
    keywords:["rodízio","sq65 hga preto","com capa"],
    variations:[
      {sku:"11.ROD.PIN.SQ65",label:"SQ65 HGA Preto · Com Capa",tiers:[{minQty:1,label:"1",price:17.99}, {minQty:5,label:"5",price:15.99}, {minQty:10,label:"10",price:14.99}, {minQty:50,label:"50",price:13.99}],weight:"A consultar",ncm:"94039900"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"11.ROD.SEM.PIN",
    slug:"11-rod-sem-pin",
    name:"Rodízio Sem Pino Encaixe Universal para cadeira de Escritório | SQ90",
    description:"Rodizio · SQ90 · Sem Pino",
    category:"Ferragens",
    subcategory:"Rodízios",
    brand:"Squadroni",
    supplier:"Squadroni",
    keywords:["rodizio","sq90","sem pino"],
    variations:[
      {sku:"11.ROD.SEM.PIN.SQ90",label:"SQ90 · Sem Pino",tiers:[{minQty:1,label:"1",price:6.39}, {minQty:5,label:"5",price:5.69}, {minQty:10,label:"10",price:5.19}, {minQty:50,label:"50",price:4.99}],weight:"A consultar",ncm:"94039900"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"12.BOT",
    slug:"12-bot",
    name:"Botão On Off Inox 19mm Prata 3a Com Led 12v - 4 Cores",
    description:"Botão On Off Inox 19mm Prata 3a Com Led 12v - 4 Cores",
    category:"Elétrica",
    subcategory:"Botões",
    brand:"Storm",
    supplier:"Storm",
    keywords:["botão on/off","19mm","3a","azul","vermelho","verde","branco","chicote","led","12v"],
    variations:[
      {sku:"12.BOT.AZ",label:"3A · Azul",tiers:[{minQty:1,label:"1",price:29.99}, {minQty:3,label:"3",price:26.99}, {minQty:5,label:"5",price:24.99}, {minQty:10,label:"10",price:23.39}],weight:"A consultar",ncm:"85365090"},
      {sku:"12.BOT.VM",label:"3A · Vermelho",tiers:[{minQty:1,label:"1",price:29.99}, {minQty:3,label:"3",price:26.99}, {minQty:5,label:"5",price:24.99}, {minQty:10,label:"10",price:23.39}],weight:"A consultar",ncm:"85365090"},
      {sku:"12.BOT.VD",label:"3A · Verde",tiers:[{minQty:1,label:"1",price:29.99}, {minQty:3,label:"3",price:26.99}, {minQty:5,label:"5",price:24.99}, {minQty:10,label:"10",price:23.39}],weight:"A consultar",ncm:"85365090"},
      {sku:"12.BOT.BR",label:"3A · Branco",tiers:[{minQty:1,label:"1",price:29.99}, {minQty:3,label:"3",price:26.99}, {minQty:5,label:"5",price:24.99}, {minQty:10,label:"10",price:23.39}],weight:"A consultar",ncm:"85365090"},
      {sku:"12.CHIC.19MM",label:"Chicote · 19mm",tiers:[{minQty:1,label:"1",price:8.69}, {minQty:3,label:"3",price:7.99}, {minQty:5,label:"5",price:6.99}, {minQty:10,label:"10",price:6.49}],weight:"A consultar",ncm:"85444200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"12.CHIC",
    slug:"12-chic",
    name:"Chicote para Botão ON/OFF 19mm",
    description:"Chicote para Botão ON/OFF 19mm",
    category:"Elétrica",
    subcategory:"Botões",
    brand:"Storm",
    supplier:"Storm",
    keywords:["chicote para botão on/off 19mm"],
    variations:[
      {sku:"12.CHIC.19MM",label:"19MM",tiers:[{minQty:1,label:"1",price:8.69}, {minQty:3,label:"3",price:7.99}, {minQty:5,label:"5",price:6.99}, {minQty:10,label:"10",price:6.49}],weight:"A consultar",ncm:"85444200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"12.CAB.1M.AZ",
    slug:"12-cab-1m-az",
    name:"Cabo Rca",
    description:"Cabo Rca · 1 Metro · Azul · Blindado · 5mm",
    category:"Elétrica",
    subcategory:"Cabos e Fios",
    brand:"Storm",
    supplier:"Storm",
    keywords:["cabo rca","1 metro","azul","blindado","5mm"],
    variations:[
      {sku:"12.CAB.1M.AZ.5MM",label:"Blindado · 5mm",tiers:[{minQty:1,label:"1",price:54.99}, {minQty:3,label:"3",price:52.99}, {minQty:5,label:"5",price:49.99}, {minQty:10,label:"10",price:46.99}],weight:"A consultar",ncm:"85444200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"12.CAB.RED.BR",
    slug:"12-cab-red-br",
    name:"Fixa Cabos",
    description:"Fixa Cabos · Redondo · 5mm · Cento",
    category:"Elétrica",
    subcategory:"Fixação de Cabos",
    brand:"Storm",
    supplier:"Storm",
    keywords:["fixa cabos","redondo","5mm","cento","6mm","7mm","8mm","10mm"],
    variations:[
      {sku:"12.CAB.RED.BR.5MM",label:"5mm · Cento",tiers:[{minQty:1,label:"1",price:5.49}, {minQty:5,label:"5",price:4.99}, {minQty:10,label:"10",price:4.49}, {minQty:50,label:"50",price:3.99}],weight:"A consultar",ncm:"73170090"},
      {sku:"12.CAB.RED.BR.6MM",label:"6mm · Cento",tiers:[{minQty:1,label:"1",price:5.69}, {minQty:5,label:"5",price:5.19}, {minQty:10,label:"10",price:4.69}, {minQty:50,label:"50",price:4.19}],weight:"A consultar",ncm:"73170090"},
      {sku:"12.CAB.RED.BR.7MM",label:"7mm · Cento",tiers:[{minQty:1,label:"1",price:7.69}, {minQty:5,label:"5",price:6.79}, {minQty:10,label:"10",price:6.19}, {minQty:50,label:"50",price:5.69}],weight:"A consultar",ncm:"73170090"},
      {sku:"12.CAB.RED.BR.8MM",label:"8mm · Cento",tiers:[{minQty:1,label:"1",price:8.99}, {minQty:5,label:"5",price:8.49}, {minQty:10,label:"10",price:7.49}, {minQty:50,label:"50",price:6.99}],weight:"A consultar",ncm:"73170090"},
      {sku:"12.CAB.RED.BR.10MM",label:"10mm · Cento",tiers:[{minQty:1,label:"1",price:9.99}, {minQty:5,label:"5",price:9.69}, {minQty:10,label:"10",price:8.99}, {minQty:50,label:"50",price:8.69}],weight:"A consultar",ncm:"73170090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"13.BLT",
    slug:"13-blt",
    name:"Bucha para Gesso/Drywall com Parafuso",
    description:"Bucha para Gesso/Drywall com Parafuso · 3/16 e 1/4 · 2.1/2",
    category:"Fixação",
    subcategory:"Buchas",
    brand:"Sfor",
    supplier:"Sfor",
    keywords:["bucha bolt","bucha para gesso","gesso","drywall","com parafuso","3/16","1/4","2.1/2","fixação drywall"],
    variations:[
      {sku:"13.BLT.3.16",label:"3/16 x 2.1/2",tiers:[{minQty:1,label:"1",price:6.69}, {minQty:50,label:"50",price:5.99}, {minQty:100,label:"100",price:5.39}, {minQty:500,label:"500",price:4.99}],weight:"A consultar",ncm:"73181500"},
      {sku:"13.BLT.1.4",label:"1/4 x 2.1/2",tiers:[{minQty:1,label:"1",price:6.69}, {minQty:50,label:"50",price:5.99}, {minQty:100,label:"100",price:5.39}, {minQty:500,label:"500",price:4.99}],weight:"A consultar",ncm:"73181500"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"14.SUP",
    slug:"suporte-simples",
    name:"Suporte Simples para Encaixe em Trilho Cremalheira Simples",
    description:"Suporte Simples para Encaixe em Trilho Cremalheira Simples · Branco e Preto · 15cm, 20cm, 25cm e 30cm",
    category:"Ferragens",
    subcategory:"Suportes",
    brand:"Fertak",
    supplier:"Fertak",
    keywords:["suporte simples","trilho cremalheira","encaixe","branco","preto","15cm","20cm","25cm","30cm"],
    variations:[
      {sku:"25.SUP.BR.15",label:"Branco · 15cm",tiers:[{minQty:1,label:"1",price:4.49}, {minQty:10,label:"10",price:3.79}, {minQty:20,label:"20",price:3.59}, {minQty:100,label:"100",price:3.39}],weight:"A consultar",ncm:"83024200"},
      {sku:"14.SUP.BR.20",label:"Branco · 20cm",tiers:[{minQty:1,label:"1",price:4.59}, {minQty:10,label:"10",price:3.89}, {minQty:20,label:"20",price:3.69}, {minQty:100,label:"100",price:3.49}],weight:"A consultar",ncm:"83024900"},
      {sku:"14.SUP.BR.25",label:"Branco · 25cm",tiers:[{minQty:1,label:"1",price:6.39}, {minQty:10,label:"10",price:5.89}, {minQty:20,label:"20",price:5.39}, {minQty:100,label:"100",price:4.99}],weight:"A consultar",ncm:"83024900"},
      {sku:"14.SUP.BR.30",label:"Branco · 30cm",tiers:[{minQty:1,label:"1",price:6.99}, {minQty:10,label:"10",price:6.39}, {minQty:20,label:"20",price:5.89}, {minQty:100,label:"100",price:5.59}],weight:"A consultar",ncm:"83024900"},
      {sku:"25.SUP.PT.15",label:"Preto · 15cm",tiers:[{minQty:1,label:"1",price:4.49}, {minQty:10,label:"10",price:3.79}, {minQty:20,label:"20",price:3.59}, {minQty:100,label:"100",price:3.39}],weight:"A consultar",ncm:"83024200"},
      {sku:"25.SUP.PT.20",label:"Preto · 20cm",tiers:[{minQty:1,label:"1",price:4.59}, {minQty:10,label:"10",price:3.89}, {minQty:20,label:"20",price:3.69}, {minQty:100,label:"100",price:3.49}],weight:"A consultar",ncm:"83024200"},
      {sku:"25.SUP.PT.25",label:"Preto · 25cm",tiers:[{minQty:1,label:"1",price:6.39}, {minQty:10,label:"10",price:5.89}, {minQty:20,label:"20",price:5.39}, {minQty:100,label:"100",price:4.99}],weight:"A consultar",ncm:"83024200"},
      {sku:"25.SUP.PT.30",label:"Preto · 30cm",tiers:[{minQty:1,label:"1",price:6.99}, {minQty:10,label:"10",price:6.39}, {minQty:20,label:"20",price:5.89}, {minQty:100,label:"100",price:5.59}],weight:"A consultar",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"14.TS",
    slug:"trilho-simples",
    name:"Trilho Cremalheira Simples em Aço Carbono | Branco e Preto",
    description:"Trilho Cremalheira Simples em Aço Carbono | Branco e Preto · 50cm a 2m",
    category:"Ferragens",
    subcategory:"Trilhos",
    brand:"Fertak",
    supplier:"Fertak",
    keywords:["trilho simples","trilho cremalheira","branco","preto","50cm","1m","1,5m","2m"],
    variations:[
      {sku:"14.TS.BR.50",label:"Branco · 50cm",tiers:[{minQty:1,label:"1",price:8.39}, {minQty:5,label:"5",price:7.79}, {minQty:10,label:"10",price:6.99}, {minQty:20,label:"20",price:6.69}],weight:"A consultar",ncm:"83024900"},
      {sku:"14.TS.BR.100",label:"Branco · 1m",tiers:[{minQty:1,label:"1",price:14.99}, {minQty:5,label:"5",price:13.99}, {minQty:10,label:"10",price:12.99}, {minQty:20,label:"20",price:11.99}],weight:"A consultar",ncm:"83024900"},
      {sku:"14.TS.BR.150",label:"Branco · 1,5m",tiers:[{minQty:1,label:"1",price:21.99}, {minQty:5,label:"5",price:20.99}, {minQty:10,label:"10",price:19.99}, {minQty:20,label:"20",price:18.99}],weight:"A consultar",ncm:"83024900"},
      {sku:"14.TS.BR.200",label:"Branco · 2m",tiers:[{minQty:1,label:"1",price:23.99}, {minQty:5,label:"5",price:21.99}, {minQty:10,label:"10",price:20.99}, {minQty:20,label:"20",price:19.99}],weight:"A consultar",ncm:"83024900"},
      {sku:"25.TS.100.PT",label:"Preto · 1m",tiers:[{minQty:1,label:"1",price:14.99}, {minQty:5,label:"5",price:13.99}, {minQty:10,label:"10",price:12.99}, {minQty:20,label:"20",price:11.99}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"14.SDS",
    slug:"14-sds",
    name:"Broca SDS para Concreto Encaixe Rápido 160mm",
    description:"Broca SDS para concreto · encaixe rápido · 160mm · diâmetros 6, 8, 10, 12 e 14mm",
    category:"Fixação",
    subcategory:"Brocas",
    brand:"Fertak",
    supplier:"Fertak",
    keywords:["broca sds","concreto","encaixe rápido","160mm","6x160","8x160","10x160","12x160","14x160"],
    variations:[
      {sku:"14.SDS.6.160",label:"6x160 mm",tiers:[{minQty:1,label:"1",price:7.69}, {minQty:10,label:"10",price:7.39}, {minQty:30,label:"30",price:6.99}, {minQty:50,label:"50",price:6.39}],weight:"A consultar",ncm:"82075011"},
      {sku:"14.SDS.8.160",label:"8x160 mm",tiers:[{minQty:1,label:"1",price:7.99}, {minQty:10,label:"10",price:7.69}, {minQty:30,label:"30",price:7.39}, {minQty:50,label:"50",price:6.99}],weight:"A consultar",ncm:"82075011"},
      {sku:"14.SDS.10.160",label:"10x160 mm",tiers:[{minQty:1,label:"1",price:8.89}, {minQty:10,label:"10",price:7.99}, {minQty:30,label:"30",price:6.99}, {minQty:50,label:"50",price:6.69}],weight:"A consultar",ncm:"82075011"},
      {sku:"14.SDS.12.160",label:"12x160 mm",tiers:[{minQty:1,label:"1",price:9.99}, {minQty:10,label:"10",price:8.99}, {minQty:30,label:"30",price:8.69}, {minQty:50,label:"50",price:8.29}],weight:"A consultar",ncm:"82075011"},
      {sku:"14.SDS.14.160",label:"14x160 mm",tiers:[{minQty:1,label:"1",price:12.69}, {minQty:10,label:"10",price:11.99}, {minQty:30,label:"30",price:10.99}, {minQty:50,label:"50",price:9.99}],weight:"A consultar",ncm:"82075011"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"14.MAOF",
    slug:"14-maof",
    name:"Mão Francesa Cantoneira Leve | 20cm a 40cm",
    description:"Mão Francesa Cantoneira Leve | 20cm a 40cm",
    category:"Ferragens",
    subcategory:"Mãos Francesas",
    brand:"Fertak",
    supplier:"Fertak",
    keywords:["mão francesa cantoneira leve","cantoneira","branca","preta","20cm","25cm","30cm","40cm"],
    variations:[
      {sku:"14.MAOF.BR.20",label:"Branca · 20cm",tiers:[{minQty:1,label:"1",price:3.79}, {minQty:12,label:"12",price:3.39}, {minQty:60,label:"60",price:3.09}, {minQty:120,label:"120",price:2.99}],weight:"A consultar",ncm:"83024900"},
      {sku:"14.MAOF.BR.25",label:"Branca · 25cm",tiers:[{minQty:1,label:"1",price:4.99}, {minQty:12,label:"12",price:4.59}, {minQty:60,label:"60",price:4.09}, {minQty:120,label:"120",price:3.99}],weight:"A consultar",ncm:"83024900"},
      {sku:"14.MAOF.BR.30",label:"Branca · 30cm",tiers:[{minQty:1,label:"1",price:5.99}, {minQty:12,label:"12",price:5.49}, {minQty:60,label:"60",price:5.09}, {minQty:120,label:"120",price:4.99}],weight:"A consultar",ncm:"83024900"},
      {sku:"14.MAOF.BR.40",label:"Branca · 40cm",tiers:[{minQty:1,label:"1",price:10.99}, {minQty:12,label:"12",price:9.99}, {minQty:60,label:"60",price:9.69}, {minQty:120,label:"120",price:9.49}],weight:"A consultar",ncm:"83024900"},
      {sku:"14.MAOF.PT.20",label:"Preta · 20cm",tiers:[{minQty:1,label:"1",price:3.79}, {minQty:12,label:"12",price:3.39}, {minQty:60,label:"60",price:3.09}, {minQty:120,label:"120",price:2.99}],weight:"A consultar",ncm:"83024900"},
      {sku:"14.MAOF.PT.25",label:"Preta · 25cm",tiers:[{minQty:1,label:"1",price:4.99}, {minQty:12,label:"12",price:4.59}, {minQty:60,label:"60",price:4.09}, {minQty:120,label:"120",price:3.99}],weight:"A consultar",ncm:"83024900"},
      {sku:"14.MAOF.PT.30",label:"Preta · 30cm",tiers:[{minQty:1,label:"1",price:5.99}, {minQty:12,label:"12",price:5.49}, {minQty:60,label:"60",price:5.09}, {minQty:120,label:"120",price:4.99}],weight:"A consultar",ncm:"83024900"},
      {sku:"14.MAOF.PT.40",label:"Preta · 40cm",tiers:[{minQty:1,label:"1",price:10.99}, {minQty:12,label:"12",price:9.99}, {minQty:60,label:"60",price:9.69}, {minQty:120,label:"120",price:9.49}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"14.DISC.LIX.125",
    slug:"14-disc-lix-125",
    name:"Disco de Lixa Com Furos",
    description:"Disco de Lixa Com Furos · 125mm · Grão 40",
    category:"Abrasivos",
    subcategory:"Discos com Furos",
    brand:"Fertak",
    supplier:"Fertak",
    keywords:["disco de lixa com furos","125mm","grão 40","grão 60","grão 80","grão 100","grão 120","grão 150","grão 180","grão 240"],
    variations:[
      {sku:"14.DISC.LIX.125.40",label:"125mm · Grão 40",tiers:[{minQty:1,label:"1",price:1.09}, {minQty:10,label:"10",price:0.99}, {minQty:50,label:"50",price:0.89}, {minQty:100,label:"100",price:0.79}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.DISC.LIX.125.60",label:"125mm · Grão 60",tiers:[{minQty:1,label:"1",price:1.09}, {minQty:10,label:"10",price:0.99}, {minQty:50,label:"50",price:0.89}, {minQty:100,label:"100",price:0.79}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.DISC.LIX.125.80",label:"125mm · Grão 80",tiers:[{minQty:1,label:"1",price:1.09}, {minQty:10,label:"10",price:0.99}, {minQty:50,label:"50",price:0.89}, {minQty:100,label:"100",price:0.79}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.DISC.LIX.125.100",label:"125mm · Grão 100",tiers:[{minQty:1,label:"1",price:1.09}, {minQty:10,label:"10",price:0.99}, {minQty:50,label:"50",price:0.89}, {minQty:100,label:"100",price:0.79}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.DISC.LIX.125.120",label:"125mm · Grão 120",tiers:[{minQty:1,label:"1",price:1.09}, {minQty:10,label:"10",price:0.99}, {minQty:50,label:"50",price:0.89}, {minQty:100,label:"100",price:0.79}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.DISC.LIX.125.150",label:"125mm · Grão 150",tiers:[{minQty:1,label:"1",price:1.09}, {minQty:10,label:"10",price:0.99}, {minQty:50,label:"50",price:0.89}, {minQty:100,label:"100",price:0.79}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.DISC.LIX.125.180",label:"125mm · Grão 180",tiers:[{minQty:1,label:"1",price:1.09}, {minQty:10,label:"10",price:0.99}, {minQty:50,label:"50",price:0.89}, {minQty:100,label:"100",price:0.79}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.DISC.LIX.125.240",label:"125mm · Grão 240",tiers:[{minQty:1,label:"1",price:1.09}, {minQty:10,label:"10",price:0.99}, {minQty:50,label:"50",price:0.89}, {minQty:100,label:"100",price:0.79}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.DISC.LIX.125.320",label:"125mm · Grão 320",tiers:[{minQty:1,label:"1",price:1.09}, {minQty:10,label:"10",price:0.99}, {minQty:50,label:"50",price:0.89}, {minQty:100,label:"100",price:0.79}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.DISC.LIX.125.400",label:"125mm · Grão 400",tiers:[{minQty:1,label:"1",price:1.09}, {minQty:10,label:"10",price:0.99}, {minQty:50,label:"50",price:0.89}, {minQty:100,label:"100",price:0.79}],weight:"A consultar",ncm:"68053020"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"14.FLAP.115",
    slug:"14-flap-115",
    name:"Disco Flap 115mm | Madeira e Aço | Fertak",
    description:"Disco Flap 115mm | Madeira e Aço | Fertak",
    category:"Abrasivos",
    subcategory:"Disco Flap",
    brand:"Fertak",
    supplier:"Fertak",
    keywords:["disco flap","madeira e aço","madeira","aço","fertak","115mm","grão 40","grão 60","grão 80","grão 120"],
    variations:[
      {sku:"14.FLAP.115.40",label:"115mm · Grão 40",tiers:[{minQty:1,label:"1",price:5.99}, {minQty:10,label:"10",price:5.69}, {minQty:50,label:"50",price:4.99}, {minQty:200,label:"200",price:4.79}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.FLAP.115.60",label:"115mm · Grão 60",tiers:[{minQty:1,label:"1",price:5.99}, {minQty:10,label:"10",price:5.69}, {minQty:50,label:"50",price:4.99}, {minQty:200,label:"200",price:4.79}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.FLAP.115.80",label:"115mm · Grão 80",tiers:[{minQty:1,label:"1",price:5.99}, {minQty:10,label:"10",price:5.69}, {minQty:50,label:"50",price:4.99}, {minQty:200,label:"200",price:4.79}],weight:"A consultar",ncm:"68053020"},
      {sku:"14.FLAP.115.120",label:"115mm · Grão 120",tiers:[{minQty:1,label:"1",price:5.99}, {minQty:10,label:"10",price:5.69}, {minQty:50,label:"50",price:4.99}, {minQty:200,label:"200",price:4.79}],weight:"A consultar",ncm:"68053020"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"14.LA",
    slug:"14-la",
    name:"Lâmina para Estilete",
    description:"Lâmina para Estilete · 18mm · 10 Peças",
    category:"Ferramentas",
    subcategory:"Lâminas",
    brand:"Fertak",
    supplier:"Fertak",
    keywords:["lâmina para estilete","18mm","10 peças","25mm"],
    variations:[
      {sku:"14.LA.18MM",label:"18mm · 10 Peças",tiers:[{minQty:1,label:"1",price:3.99}, {minQty:10,label:"10",price:3.39}, {minQty:50,label:"50",price:2.99}, {minQty:100,label:"100",price:2.69}],weight:"A consultar",ncm:"82119400"},
      {sku:"14.LA.25MM",label:"25mm · 10 Peças",tiers:[{minQty:1,label:"1",price:12.99}, {minQty:10,label:"10",price:11.99}, {minQty:50,label:"50",price:10.99}, {minQty:100,label:"100",price:9.99}],weight:"A consultar",ncm:"82119400"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"14.ABRAC.4.8.200",
    slug:"14-abrac-4-8-200",
    name:"Abraçadeira de Nylon",
    description:"Abraçadeira de Nylon · Preta · 4,8 x 200",
    category:"Fixação",
    subcategory:"Abraçadeiras",
    brand:"Fertak",
    supplier:"Fertak",
    keywords:["abraçadeira de nylon","preta","4,8 x 200"],
    variations:[
      {sku:"14.ABRAC.4.8.200.PT",label:"Preta · 4,8 x 200",tiers:[{minQty:1,label:"1",price:9.99}, {minQty:3,label:"3",price:8.99}, {minQty:5,label:"5",price:8.39}, {minQty:10,label:"10",price:7.99}],weight:"A consultar",ncm:"39269090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"15.GAN.LV",
    slug:"15-gan-lv",
    name:"Gancho de Rede (Par)",
    description:"Gancho de Rede (Par) · Zincado",
    category:"Fixação",
    subcategory:"Ganchos",
    brand:"São Raphael",
    supplier:"São Raphael",
    keywords:["gancho de rede (par)","zincado"],
    variations:[
      {sku:"15.GAN.LV.ZC",label:"Zincado",tiers:[{minQty:1,label:"1",price:10.99}, {minQty:3,label:"3",price:10.69}, {minQty:5,label:"5",price:9.99}, {minQty:10,label:"10",price:8.99}],weight:"A consultar",ncm:"73269090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"15.GAN.FEC",
    slug:"15-gan-fec",
    name:"Parafuso Gancho Zinco | Para bucha",
    description:"Parafuso Gancho Zinco · Para bucha · 8mm / 6mm / 5mm",
    category:"Fixação",
    subcategory:"Parafusos",
    brand:"São Raphael",
    supplier:"São Raphael",
    keywords:["parafuso gancho","zinco","zincado","para bucha","gancho para bucha","8mm","6mm","5mm"],
    variations:[
      {sku:"15.GAN.FEC.8",label:"8mm",tiers:[{minQty:1,label:"1",price:0.49}, {minQty:30,label:"30",price:0.39}, {minQty:50,label:"50",price:0.39}, {minQty:100,label:"100",price:0.33}],weight:"A consultar",ncm:"73181300"},
      {sku:"15.GAN.FEC.6",label:"6mm",tiers:[{minQty:1,label:"1",price:0.29}, {minQty:30,label:"30",price:0.19}, {minQty:50,label:"50",price:0.18}, {minQty:100,label:"100",price:0.17}],weight:"A consultar",ncm:"73181300"},
      {sku:"15.GAN.FEC.5",label:"5mm",tiers:[{minQty:1,label:"1",price:0.19}, {minQty:30,label:"30",price:0.14}, {minQty:50,label:"50",price:0.13}, {minQty:100,label:"100",price:0.12}],weight:"A consultar",ncm:"73181300"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"15.GAN.S",
    slug:"15-gan-s",
    name:"Gancho em S",
    description:"Gancho em S · 28mm",
    category:"Fixação",
    subcategory:"Ganchos",
    brand:"São Raphael",
    supplier:"São Raphael",
    keywords:["gancho em s","28mm","53mm","63mm"],
    variations:[
      {sku:"15.GAN.S.28",label:"28mm",tiers:[{minQty:1,label:"1",price:0.29}, {minQty:50,label:"50",price:0.27}, {minQty:100,label:"100",price:0.24}, {minQty:500,label:"500",price:0.23}],weight:"A consultar",ncm:"73269090"},
      {sku:"15.GAN.S.53",label:"53mm",tiers:[{minQty:1,label:"1",price:0.79}, {minQty:50,label:"50",price:0.69}, {minQty:100,label:"100",price:0.63}, {minQty:500,label:"500",price:0.59}],weight:"A consultar",ncm:"73269090"},
      {sku:"15.GAN.S.63",label:"63mm",tiers:[{minQty:1,label:"1",price:1.29}, {minQty:50,label:"50",price:1.09}, {minQty:100,label:"100",price:0.99}, {minQty:500,label:"500",price:0.89}],weight:"A consultar",ncm:"73269090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"15.MOSQ",
    slug:"15-mosq",
    name:"Mosquetão Aço com Mola Profissional Academia",
    description:"Mosquetão Aço com Mola Profissional Academia · 7 x 70 · 180kgs",
    category:"Fixação",
    subcategory:"Ganchos",
    brand:"São Raphael",
    supplier:"São Raphael",
    keywords:["mosquetão mola","7 x 70","180kgs","8 x 80","230kgs","10 x 100","350kgs"],
    variations:[
      {sku:"15.MOSQ.7X70",label:"7 x 70 · 180kgs",tiers:[{minQty:1,label:"1",price:3.79}, {minQty:5,label:"5",price:3.29}, {minQty:10,label:"10",price:2.99}, {minQty:20,label:"20",price:2.79}],weight:"A consultar",ncm:"73269090"},
      {sku:"15.MOSQ.8X80",label:"8 x 80 · 230kgs",tiers:[{minQty:1,label:"1",price:3.99}, {minQty:5,label:"5",price:3.69}, {minQty:10,label:"10",price:3.39}, {minQty:20,label:"20",price:3.09}],weight:"A consultar",ncm:"73269090"},
      {sku:"15.MOSQ.10X100",label:"10 x 100 · 350kgs",tiers:[{minQty:1,label:"1",price:7.59}, {minQty:5,label:"5",price:6.99}, {minQty:10,label:"10",price:5.99}, {minQty:20,label:"20",price:5.69}],weight:"A consultar",ncm:"73269090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"16.MOLA",
    slug:"16-mola",
    name:"Mola Aerea",
    description:"Mola Aerea · Coimbra · Branca",
    category:"Ferragens",
    subcategory:"Molas Aéreas",
    brand:"Coimbra",
    supplier:"Coimbra",
    keywords:["mola aerea","coimbra","branca","preta","ouro","cinza","zincado"],
    variations:[
      {sku:"16.MOLA.BR",label:"Branca",tiers:[{minQty:1,label:"1",price:76.99}, {minQty:3,label:"3",price:73.99}, {minQty:5,label:"5",price:69.99}, {minQty:10,label:"10",price:65.99}],weight:"A consultar",ncm:"83026000"},
      {sku:"16.MOLA.PT",label:"Preta",tiers:[{minQty:1,label:"1",price:76.99}, {minQty:3,label:"3",price:73.99}, {minQty:5,label:"5",price:69.99}, {minQty:10,label:"10",price:65.99}],weight:"A consultar",ncm:"83026000"},
      {sku:"16.MOLA.OU",label:"Ouro",tiers:[{minQty:1,label:"1",price:76.99}, {minQty:3,label:"3",price:73.99}, {minQty:5,label:"5",price:69.99}, {minQty:10,label:"10",price:65.99}],weight:"A consultar",ncm:"83026000"},
      {sku:"16.MOLA.CZ",label:"Cinza",tiers:[{minQty:1,label:"1",price:76.99}, {minQty:3,label:"3",price:73.99}, {minQty:5,label:"5",price:69.99}, {minQty:10,label:"10",price:65.99}],weight:"A consultar",ncm:"83026000"},
      {sku:"16.MOLA.ZN",label:"Zincado",tiers:[{minQty:1,label:"1",price:76.99}, {minQty:3,label:"3",price:73.99}, {minQty:5,label:"5",price:69.99}, {minQty:10,label:"10",price:65.99}],weight:"A consultar",ncm:"83026000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"18.MF.RET.BR",
    slug:"18-mf-ret-br",
    name:"Mão Francesa Cantoneira",
    description:"Mão Francesa Cantoneira · Dobrável · 20cm",
    category:"Ferragens",
    subcategory:"Mãos Francesas",
    brand:"Idea",
    supplier:"Idea",
    keywords:["mão francesa cantoneira","dobrável","20cm","25cm","30cm","35cm","40cm","45cm"],
    variations:[
      {sku:"18.MF.RET.BR.20",label:"Dobrável · 20cm",tiers:[{minQty:1,label:"1",price:46.99}, {minQty:3,label:"3",price:43.99}, {minQty:5,label:"5",price:39.99}, {minQty:10,label:"10",price:36.99}],weight:"A consultar",ncm:"83024200"},
      {sku:"18.MF.RET.BR.25",label:"Dobrável · 25cm",tiers:[{minQty:1,label:"1",price:54.99}, {minQty:3,label:"3",price:52.99}, {minQty:5,label:"5",price:49.99}, {minQty:10,label:"10",price:45.99}],weight:"A consultar",ncm:"83024200"},
      {sku:"18.MF.RET.BR.30",label:"Dobrável · 30cm",tiers:[{minQty:1,label:"1",price:57.99}, {minQty:3,label:"3",price:54.99}, {minQty:5,label:"5",price:51.99}, {minQty:10,label:"10",price:48.99}],weight:"A consultar",ncm:"83024200"},
      {sku:"18.MF.RET.BR.35",label:"Dobrável · 35cm",tiers:[{minQty:1,label:"1",price:59.99}, {minQty:3,label:"3",price:56.99}, {minQty:5,label:"5",price:54.99}, {minQty:10,label:"10",price:52.99}],weight:"A consultar",ncm:"83024200"},
      {sku:"18.MF.RET.BR.40",label:"Dobrável · 40cm",tiers:[{minQty:1,label:"1",price:64.99}, {minQty:3,label:"3",price:61.99}, {minQty:5,label:"5",price:58.99}, {minQty:10,label:"10",price:56.99}],weight:"A consultar",ncm:"83024200"},
      {sku:"18.MF.RET.BR.45",label:"Dobrável · 45cm",tiers:[{minQty:1,label:"1",price:66.99}, {minQty:3,label:"3",price:63.99}, {minQty:5,label:"5",price:61.99}, {minQty:10,label:"10",price:58.99}],weight:"A consultar",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"19.FEC.ROLET",
    slug:"19-fec-rolet",
    name:"Fecho Rolete",
    description:"Fecho Rolete · Bicromatizado",
    category:"Ferragens",
    subcategory:"Fechos",
    brand:"Máxima",
    supplier:"Máxima",
    keywords:["fecho rolete","bicromatizado","zincado"],
    variations:[
      {sku:"19.FEC.ROLET.DO",label:"Bicromatizado",tiers:[{minQty:1,label:"1",price:2.99}, {minQty:50,label:"50",price:2.79}, {minQty:100,label:"100",price:2.59}, {minQty:500,label:"500",price:2.39}],weight:"A consultar",ncm:"83013000"},
      {sku:"19.FEC.ROLET.PR",label:"Zincado",tiers:[{minQty:1,label:"1",price:2.99}, {minQty:50,label:"50",price:2.79}, {minQty:100,label:"100",price:2.59}, {minQty:500,label:"500",price:2.39}],weight:"A consultar",ncm:"83013000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"19.BATENT",
    slug:"19-batent",
    name:"Batente de Porta",
    description:"Batente de Porta · Cromado · Max 118",
    category:"Ferragens",
    subcategory:"Batentes",
    brand:"Máxima",
    supplier:"Máxima",
    keywords:["batente de porta","cromado","max 118"],
    variations:[
      {sku:"19.BATENT.MAX118",label:"Cromado · Max 118",tiers:[{minQty:1,label:"1",price:34.99}, {minQty:3,label:"3",price:32.99}, {minQty:5,label:"5",price:30.99}, {minQty:10,label:"10",price:28.99}],weight:"A consultar",ncm:"83024100"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"19.TRAV",
    slug:"19-trav",
    name:"Trava Porta",
    description:"Trava Porta · MAX831",
    category:"Ferragens",
    subcategory:"Travas",
    brand:"Máxima",
    supplier:"Máxima",
    keywords:["trava porta","max831"],
    variations:[
      {sku:"19.TRAV.PATO",label:"MAX831",tiers:[{minQty:1,label:"1",price:31.99}, {minQty:3,label:"3",price:28.99}, {minQty:5,label:"5",price:25.99}, {minQty:10,label:"10",price:24.99}],weight:"A consultar",ncm:"83024100"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"20.DISC.125.BR",
    slug:"20-disc-125-br",
    name:"Disco de Lixa Pluma | 125mm | Branco | Disflex",
    description:"Disco de Lixa Pluma | 125mm | Branco | Disflex",
    category:"Abrasivos",
    subcategory:"Discos de Lixa",
    brand:"Disflex",
    supplier:"Disflex",
    keywords:["disco de lixa pluma","125mm","branco","disflex","grão 40","grão 60","grão 80","grão 100","grão 120","grão 150","grão 180","grão 220","grão 320","grão 400","grão 600"],
    variations:[
      {sku:"20.DISC.125.BR.40",label:"Branco · Grão 40",tiers:[{minQty:1,label:"1",price:1.69}, {minQty:10,label:"10",price:1.49}, {minQty:30,label:"30",price:1.39}, {minQty:50,label:"50",price:1.29}],weight:"A consultar",ncm:"68053090"},
      {sku:"20.DISC.125.BR.60",label:"Branco · Grão 60",tiers:[{minQty:1,label:"1",price:1.69}, {minQty:10,label:"10",price:1.49}, {minQty:30,label:"30",price:1.39}, {minQty:50,label:"50",price:1.29}],weight:"A consultar",ncm:"68053090"},
      {sku:"20.DISC.125.BR.80",label:"Branco · Grão 80",tiers:[{minQty:1,label:"1",price:1.69}, {minQty:10,label:"10",price:1.49}, {minQty:30,label:"30",price:1.39}, {minQty:50,label:"50",price:1.29}],weight:"A consultar",ncm:"68053090"},
      {sku:"20.DISC.125.BR.100",label:"Branco · Grão 100",tiers:[{minQty:1,label:"1",price:1.69}, {minQty:10,label:"10",price:1.49}, {minQty:30,label:"30",price:1.39}, {minQty:50,label:"50",price:1.29}],weight:"A consultar",ncm:"68053090"},
      {sku:"20.DISC.125.BR.120",label:"Branco · Grão 120",tiers:[{minQty:1,label:"1",price:1.69}, {minQty:10,label:"10",price:1.49}, {minQty:30,label:"30",price:1.39}, {minQty:50,label:"50",price:1.29}],weight:"A consultar",ncm:"68053090"},
      {sku:"20.DISC.125.BR.150",label:"Branco · Grão 150",tiers:[{minQty:1,label:"1",price:1.69}, {minQty:10,label:"10",price:1.49}, {minQty:30,label:"30",price:1.39}, {minQty:50,label:"50",price:1.29}],weight:"A consultar",ncm:"68053090"},
      {sku:"20.DISC.125.BR.180",label:"Branco · Grão 180",tiers:[{minQty:1,label:"1",price:1.69}, {minQty:10,label:"10",price:1.49}, {minQty:30,label:"30",price:1.39}, {minQty:50,label:"50",price:1.29}],weight:"A consultar",ncm:"68053090"},
      {sku:"20.DISC.125.BR.220",label:"Branco · Grão 220",tiers:[{minQty:1,label:"1",price:1.69}, {minQty:10,label:"10",price:1.49}, {minQty:30,label:"30",price:1.39}, {minQty:50,label:"50",price:1.29}],weight:"A consultar",ncm:"68053090"},
      {sku:"20.DISC.125.BR.320",label:"Branco · Grão 320",tiers:[{minQty:1,label:"1",price:1.69}, {minQty:10,label:"10",price:1.49}, {minQty:30,label:"30",price:1.39}, {minQty:50,label:"50",price:1.29}],weight:"A consultar",ncm:"68053090"},
      {sku:"20.DISC.125.BR.400",label:"Branco · Grão 400",tiers:[{minQty:1,label:"1",price:1.69}, {minQty:10,label:"10",price:1.49}, {minQty:30,label:"30",price:1.39}, {minQty:50,label:"50",price:1.29}],weight:"A consultar",ncm:"68053090"},
      {sku:"20.DISC.125.BR.600",label:"Branco · Grão 600",tiers:[{minQty:1,label:"1",price:1.69}, {minQty:10,label:"10",price:1.49}, {minQty:30,label:"30",price:1.39}, {minQty:50,label:"50",price:1.29}],weight:"A consultar",ncm:"68053090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"20.DISC.FLAP.115",
    slug:"20-disc-flap-115",
    name:"Disco Abrasivo Removedor",
    description:"Disco Abrasivo Removedor · Preto · 115mm",
    category:"Abrasivos",
    subcategory:"Discos Especiais",
    brand:"Disflex",
    supplier:"Disflex",
    keywords:["disco abrasivo removedor","preto","115mm"],
    variations:[
      {sku:"20.DISC.FLAP.115.POLIR",label:"Preto · 115mm",tiers:[{minQty:1,label:"1",price:43.99}, {minQty:3,label:"3",price:42.99}, {minQty:5,label:"5",price:41.99}, {minQty:10,label:"10",price:40.99}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"21.PF.3.16",
    slug:"21-pf-3-16",
    name:"Parafuso Soberba Sextavado | Caixa com 100 Unidades",
    description:"Parafuso Soberba Sextavado | Caixa com 100 Unidades · 3/16 x 40mm e 1/4 x 70mm",
    category:"Fixação",
    subcategory:"Parafusos",
    brand:"Newfix",
    supplier:"Newfix",
    keywords:["parafuso soberba","sextavado","caixa com 100 unidades","3/16 x 40mm","1/4 x 70mm"],
    variations:[
      {sku:"21.PF.3.16.40",label:"3/16 x 40mm",tiers:[{minQty:1,label:"1",price:17.99}, {minQty:3,label:"3",price:16.99}, {minQty:5,label:"5",price:15.99}, {minQty:10,label:"10",price:14.99}],weight:"A consultar",ncm:"73181200"},
      {sku:"21.PF.1.4.70",label:"1/4 x 70mm",tiers:[{minQty:1,label:"1",price:31.99}, {minQty:3,label:"3",price:29.99}, {minQty:5,label:"5",price:28.99}, {minQty:10,label:"10",price:27.99}],weight:"A consultar",ncm:"73181200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"21.PF.5.0",
    slug:"21-pf-5-0",
    name:"Parafuso Chipboard",
    description:"Parafuso Chipboard · 5,0 x 40mm",
    category:"Fixação",
    subcategory:"Parafusos",
    brand:"Newfix",
    supplier:"Newfix",
    keywords:["parafuso chipboard","5,0 x 40mm"],
    variations:[
      {sku:"21.PF.5.0.40",label:"5,0 x 40mm",tiers:[{minQty:1,label:"1",price:15.99}, {minQty:3,label:"3",price:13.99}, {minQty:5,label:"5",price:12.99}, {minQty:10,label:"10",price:11.99}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"23.SUP.INV",
    slug:"23-sup-inv",
    name:"Suporte Invisível Reforçado | 9,5mm Espessura",
    description:"Suporte Invisível Reforçado · 9,5mm de espessura · Duler",
    category:"Ferragens",
    subcategory:"Suportes",
    brand:"Duler",
    supplier:"Duler",
    keywords:["suporte invisível","suporte invisível reforçado","reforçado","9,5mm","9.5mm","espessura","10cm","15cm","20cm","25cm","30cm","35cm","40cm"],
    variations:[
      {sku:"23.SUP.INV.10",label:"10cm",tiers:[{minQty:1,label:"1",price:9.99}, {minQty:5,label:"5",price:9.39}, {minQty:10,label:"10",price:8.99}, {minQty:20,label:"20",price:7.99}],weight:"A consultar",ncm:"94032090"},
      {sku:"23.SUP.INV.15",label:"15cm",tiers:[{minQty:1,label:"1",price:10.99}, {minQty:5,label:"5",price:10.39}, {minQty:10,label:"10",price:9.99}, {minQty:20,label:"20",price:8.99}],weight:"A consultar",ncm:"94032090"},
      {sku:"23.SUP.INV.20",label:"20cm",tiers:[{minQty:1,label:"1",price:11.99}, {minQty:5,label:"5",price:11.39}, {minQty:10,label:"10",price:10.99}, {minQty:20,label:"20",price:9.99}],weight:"A consultar",ncm:"94032090"},
      {sku:"23.SUP.INV.25",label:"25cm",tiers:[{minQty:1,label:"1",price:12.99}, {minQty:5,label:"5",price:12.39}, {minQty:10,label:"10",price:11.99}, {minQty:20,label:"20",price:10.99}],weight:"A consultar",ncm:"94032090"},
      {sku:"23.SUP.INV.30",label:"30cm",tiers:[{minQty:1,label:"1",price:15.39}, {minQty:5,label:"5",price:14.99}, {minQty:10,label:"10",price:13.99}, {minQty:20,label:"20",price:12.99}],weight:"A consultar",ncm:"94032090"},
      {sku:"23.SUP.INV.35",label:"35cm",tiers:[{minQty:1,label:"1",price:18.99}, {minQty:5,label:"5",price:17.99}, {minQty:10,label:"10",price:16.99}, {minQty:20,label:"20",price:15.99}],weight:"A consultar",ncm:"94032090"},
      {sku:"23.SUP.INV.40",label:"40cm",tiers:[{minQty:1,label:"1",price:19.99}, {minQty:5,label:"5",price:18.99}, {minQty:10,label:"10",price:17.99}, {minQty:500,label:"500",price:16.99}],weight:"A consultar",ncm:"94032090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"24.DOB.AMORT",
    slug:"24-dob-amort",
    name:"Dobradiça Curva",
    description:"Dobradiça Curva · Com Amortecedor",
    category:"Ferragens",
    subcategory:"Dobradiças",
    brand:"FGVTN",
    supplier:"FGVTN",
    keywords:["dobradiça curva","com amortecedor"],
    variations:[
      {sku:"24.DOB.AMORT.CUR",label:"Com Amortecedor",tiers:[{minQty:1,label:"1",price:6}, {minQty:50,label:"50",price:5}, {minQty:100,label:"100",price:4}, {minQty:500,label:"500",price:3}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"26.CAB",
    slug:"26-cab",
    name:"Protetor De Cabeça Parafusos Telhas Metálicas Vedação Inox 304 | Veipar",
    description:"Protetor De Cabeça Parafusos Telhas Metálicas Vedação Inox 304 | Veipar",
    category:"Fixação",
    subcategory:"Parafusos",
    brand:"Veipar",
    supplier:"Veipar",
    keywords:["cabeça de parafuso","veipar"],
    variations:[
      {sku:"26.CAB.PARAF",label:"PARAF",tiers:[{minQty:1,label:"1",price:1.19}, {minQty:30,label:"30",price:1.09}, {minQty:50,label:"50",price:0.99}, {minQty:100,label:"100",price:0.89}],weight:"A consultar",ncm:"79070010"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"27.COLA.CONT",
    slug:"27-cola-cont",
    name:"Cola de Contato",
    description:"Cola de Contato · 750g",
    category:"Fixação",
    subcategory:"Colas",
    brand:"Tekbond",
    supplier:"Tekbond",
    keywords:["cola de contato","750g"],
    variations:[
      {sku:"27.COLA.CONT.750G",label:"750g",tiers:[{minQty:1,label:"1",price:39.99}, {minQty:3,label:"3",price:38.99}, {minQty:5,label:"5",price:37.99}, {minQty:10,label:"10",price:36.99}],weight:"A consultar",ncm:"35069110"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"27.COLA.MOV",
    slug:"27-cola-mov",
    name:"Cola Instantânea Moveleiro 100g | Tek Bond",
    description:"Cola Instantânea Moveleiro 100g | Tek Bond",
    category:"Fixação",
    subcategory:"Colas",
    brand:"Tekbond",
    supplier:"Tekbond",
    keywords:["cola instantânea","moveleiro","100g","tek bond","tekbond","super cola","adesivo"],
    variations:[
      {sku:"27.COLA.MOV.100G",label:"Moveleiro · 100g",tiers:[{minQty:1,label:"1",price:19.99}, {minQty:3,label:"3",price:17.99}, {minQty:5,label:"5",price:16.99}, {minQty:10,label:"10",price:15.99}],weight:"A consultar",ncm:"35061010"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"27.COLA793",
    slug:"27-cola793",
    name:"Cola Instantânea Média Viscosidade | Tek Bond 793",
    description:"Cola Instantânea Média Viscosidade | Tek Bond 793",
    category:"Fixação",
    subcategory:"Colas",
    brand:"Tekbond",
    supplier:"Tekbond",
    keywords:["cola instantânea","média viscosidade","tek bond","793","100g","20g","super cola","adesivo"],
    variations:[
      {sku:"27.COLA793.100G",label:"100 gramas",tiers:[{minQty:1,label:"1",price:36.99}, {minQty:3,label:"3",price:36.39}, {minQty:5,label:"5",price:35.99}, {minQty:10,label:"10",price:34.99}],weight:"A consultar",ncm:"35061010"},
      {sku:"27.COLA793.20G",label:"20 gramas",tiers:[{minQty:1,label:"1",price:11.99}, {minQty:3,label:"3",price:10.69}, {minQty:5,label:"5",price:10.39}, {minQty:10,label:"10",price:9.99}],weight:"A consultar",ncm:"35061010"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"28.DISJ.2P",
    slug:"28-disj-2p",
    name:"Disjuntor Bipolar (2 Polos) Termomagnético | 6A até 63A | Elgin",
    description:"Disjuntor Bipolar (2 Polos) Termomagnético | 6A até 63A | Elgin",
    category:"Elétrica",
    subcategory:"Disjuntores",
    brand:"Elgin",
    supplier:"Elgin",
    keywords:["mini disjuntor","2 polos","6a","10a","16a","20a","25a","32a","40a","50a"],
    variations:[
      {sku:"28.DISJ.2P.6A",label:"2 Polos · 6A",tiers:[{minQty:1,label:"1",price:27.99}, {minQty:3,label:"3",price:26.99}, {minQty:6,label:"6",price:25.99}, {minQty:10,label:"10",price:24.99}],weight:"A consultar",ncm:"85362000"},
      {sku:"28.DISJ.2P.10A",label:"2 Polos · 10A",tiers:[{minQty:1,label:"1",price:27.99}, {minQty:3,label:"3",price:26.99}, {minQty:6,label:"6",price:25.99}, {minQty:10,label:"10",price:24.99}],weight:"A consultar",ncm:"85362000"},
      {sku:"28.DISJ.2P.16A",label:"2 Polos · 16A",tiers:[{minQty:1,label:"1",price:27.99}, {minQty:3,label:"3",price:26.99}, {minQty:6,label:"6",price:25.99}, {minQty:10,label:"10",price:24.99}],weight:"A consultar",ncm:"85362000"},
      {sku:"28.DISJ.2P.20A",label:"2 Polos · 20A",tiers:[{minQty:1,label:"1",price:27.99}, {minQty:3,label:"3",price:26.99}, {minQty:6,label:"6",price:25.99}, {minQty:10,label:"10",price:24.99}],weight:"A consultar",ncm:"85362000"},
      {sku:"28.DISJ.2P.25A",label:"2 Polos · 25A",tiers:[{minQty:1,label:"1",price:27.99}, {minQty:3,label:"3",price:26.99}, {minQty:6,label:"6",price:25.99}, {minQty:10,label:"10",price:24.99}],weight:"A consultar",ncm:"85362000"},
      {sku:"28.DISJ.2P.32A",label:"2 Polos · 32A",tiers:[{minQty:1,label:"1",price:27.99}, {minQty:3,label:"3",price:26.99}, {minQty:6,label:"6",price:25.99}, {minQty:10,label:"10",price:24.99}],weight:"A consultar",ncm:"85362000"},
      {sku:"28.DISJ.2P.40A",label:"2 Polos · 40A",tiers:[{minQty:1,label:"1",price:27.99}, {minQty:3,label:"3",price:26.99}, {minQty:6,label:"6",price:25.99}, {minQty:10,label:"10",price:24.99}],weight:"A consultar",ncm:"85362000"},
      {sku:"28.DISJ.2P.50A",label:"2 Polos · 50A",tiers:[{minQty:1,label:"1",price:27.99}, {minQty:3,label:"3",price:26.99}, {minQty:6,label:"6",price:25.99}, {minQty:10,label:"10",price:24.99}],weight:"A consultar",ncm:"85362000"},
      {sku:"28.DISJ.2P.63A",label:"2 Polos · 63A",tiers:[{minQty:1,label:"1",price:27.99}, {minQty:3,label:"3",price:26.99}, {minQty:6,label:"6",price:25.99}, {minQty:10,label:"10",price:24.99}],weight:"A consultar",ncm:"85362000"},
      {sku:"28.DISJ.2P.MIX",label:"Bipolar · MIX",tiers:[{minQty:1,label:"1",price:34.41}, {minQty:50,label:"50",price:30.97}, {minQty:100,label:"100",price:28.22}, {minQty:500,label:"500",price:24.78}],weight:"A consultar",ncm:"85362000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"29.ROD",
    slug:"29-rod",
    name:"Rodízio em Silicone PU Incolor Roda Com Trava / Sem Trava",
    description:"Rodízio em silicone PU incolor · Com Trava e Sem Trava · 35mm e 50mm",
    category:"Ferragens",
    subcategory:"Rodízios",
    brand:"Metalnox",
    supplier:"Metalnox",
    keywords:["rodízio","silicone","pu","incolor","roda","com trava","sem trava","35mm","50mm"],
    variations:[
      {sku:"29.ROD.COMT.35",label:"Com Trava · 35mm",tiers:[{minQty:1,label:"1",price:5.99}, {minQty:10,label:"10",price:5.39}, {minQty:30,label:"30",price:4.99}, {minQty:50,label:"50",price:4.69}],weight:"A consultar",ncm:"83022000"},
      {sku:"29.ROD.COMT.50",label:"Com Trava · 50mm",tiers:[{minQty:1,label:"1",price:6.99}, {minQty:10,label:"10",price:6.39}, {minQty:30,label:"30",price:5.99}, {minQty:50,label:"50",price:5.29}],weight:"A consultar",ncm:"83022000"},
      {sku:"29.ROD.SEMT.35",label:"Sem Trava · 35mm",tiers:[{minQty:1,label:"1",price:4.99}, {minQty:10,label:"10",price:4.39}, {minQty:30,label:"30",price:3.99}, {minQty:50,label:"50",price:3.69}],weight:"A consultar",ncm:"83022000"},
      {sku:"29.ROD.SEMT.50",label:"Sem Trava · 50mm",tiers:[{minQty:1,label:"1",price:5.99}, {minQty:10,label:"10",price:5.39}, {minQty:30,label:"30",price:4.99}, {minQty:50,label:"50",price:4.29}],weight:"A consultar",ncm:"83022000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"29.FEC.BATENT",
    slug:"29-fec-batent",
    name:"Fechadura Com batente + 2 Chaves | Para Gavetas",
    description:"Fechadura com batente para gavetas · acompanha 2 chaves · 17 x 22mm e 17 x 31mm",
    category:"Ferragens",
    subcategory:"Fechaduras",
    brand:"Metalnox",
    supplier:"Metalnox",
    keywords:["fechadura","com batente","2 chaves","gavetas","17 x 22mm","17 x 31mm"],
    variations:[
      {sku:"29.FEC.BATENT.22MM",label:"17 x 22mm",tiers:[{minQty:1,label:"1",price:5.99}, {minQty:5,label:"5",price:5.39}, {minQty:12,label:"12",price:4.99}, {minQty:72,label:"72",price:4.69}],weight:"A consultar",ncm:"83013000"},
      {sku:"29.FEC.BATENT.31MM",label:"17 x 31mm",tiers:[{minQty:1,label:"1",price:6.99}, {minQty:5,label:"5",price:6.39}, {minQty:12,label:"12",price:5.99}, {minQty:72,label:"72",price:5.69}],weight:"A consultar",ncm:"83013000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"29.PF",
    slug:"29-pf",
    name:"Parafuso Chipboard Bicromatizado Cabeça Chata Phillips",
    description:"Parafuso chipboard bicromatizado · cabeça chata Phillips · vários tamanhos",
    category:"Fixação",
    subcategory:"Parafusos",
    brand:"Metalnox",
    supplier:"Metalnox",
    keywords:["parafuso","chipboard","bicromatizado","cabeça chata","phillips","3,5 x 14mm","4,5 x 50mm","5,0 x 35mm","5,0 x 40mm"],
    variations:[
      {sku:"29.PF.3.5.14",label:"3,5 x 14mm",tiers:[{minQty:1,label:"1",price:2.69}, {minQty:5,label:"5",price:2.29}, {minQty:10,label:"10",price:2.09}, {minQty:30,label:"30",price:1.89}],weight:"A consultar",ncm:"73181200"},
      {sku:"29.PF.4.5.50",label:"4,5 x 50mm",tiers:[{minQty:1,label:"1",price:10.99}, {minQty:5,label:"5",price:9.99}, {minQty:10,label:"10",price:8.99}, {minQty:30,label:"30",price:8.09}],weight:"A consultar",ncm:"73181200"},
      {sku:"29.PF.5.0.35",label:"5,0 x 35mm",tiers:[{minQty:1,label:"1",price:9.99}, {minQty:5,label:"5",price:8.99}, {minQty:10,label:"10",price:7.99}, {minQty:30,label:"30",price:7.59}],weight:"A consultar",ncm:"73181200"},
      {sku:"29.PF.5.0.40",label:"5,0 x 40mm",tiers:[{minQty:1,label:"1",price:13.49}, {minQty:5,label:"5",price:12.99}, {minQty:10,label:"10",price:10.99}, {minQty:30,label:"30",price:9.99}],weight:"A consultar",ncm:"73181200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"CH.TRAV",
    slug:"ch-trav",
    name:"Trava Porta Inox | Grape Tools",
    description:"Trava Porta Inox · Grape Tools · Pato",
    category:"Ferragens",
    subcategory:"Travas",
    brand:"Grape Tools",
    supplier:"Grape Tools",
    keywords:["trava porta inox","grape tools","pato"],
    variations:[
      {sku:"CH.TRAV.PATO",label:"Pato",tiers:[{minQty:1,label:"1",price:11.99}, {minQty:3,label:"3",price:10.99}, {minQty:5,label:"5",price:9.99}, {minQty:20,label:"20",price:8.99}],weight:"120g",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"0",
    slug:"0",
    name:"Personalizado",
    description:"Personalizado",
    category:"Outros",
    subcategory:"Personalizado",
    brand:"",
    supplier:"Grape Tools",
    keywords:["personalizado"],
    variations:[
      {sku:"0",label:"0",tiers:[{minQty:1,label:"1",price:2.8}, {minQty:50,label:"50",price:2.52}, {minQty:100,label:"100",price:2.3}, {minQty:500,label:"500",price:2.02}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"30.BUCHA.C",
    slug:"30-bucha-c",
    name:"Bucha",
    description:"Bucha · 8mm · Comum · USAF · 1000 Peças",
    category:"Fixação",
    subcategory:"Buchas",
    brand:"USAF",
    supplier:"USAF",
    keywords:["bucha","8mm","comum","usaf","1000 peças"],
    variations:[
      {sku:"30.BUCHA.C.8_PCT",label:"Comum · 1000 Peças",tiers:[{minQty:1,label:"1",price:28.99}, {minQty:50,label:"50",price:27.99}, {minQty:100,label:"100",price:26.99}, {minQty:500,label:"500",price:25.99}],weight:"A consultar",ncm:"39259090"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"29.PE.QUAD.REG",
    slug:"29-pe-quad-reg",
    name:"Pé para Móveis em Aço Cromado com Regulagem de altura",
    description:"Pé para Móveis · Aço Cromado · Regulagem de Altura · Quadrado · 10cm a 20cm · Metalnox",
    category:"Ferragens",
    subcategory:"Pés de Móveis",
    brand:"Metalnox",
    supplier:"Metalnox",
    keywords:["pé móveis","pé para móveis","aço cromado","cromado","regulagem de altura","quadrado","10cm","15cm","20cm"],
    variations:[
      {sku:"29.PE.QUAD.REG.10",label:"Cromado · 10cm",tiers:[{minQty:1,label:"1",price:6.39}, {minQty:5,label:"5",price:5.69}, {minQty:10,label:"10",price:5.09}, {minQty:20,label:"20",price:4.79}],weight:"A consultar",ncm:"83024200"},
      {sku:"29.PE.QUAD.REG.15",label:"Cromado · 15cm",tiers:[{minQty:1,label:"1",price:8.69}, {minQty:5,label:"5",price:7.99}, {minQty:10,label:"10",price:6.99}, {minQty:20,label:"20",price:6.59}],weight:"A consultar",ncm:"83024200"},
      {sku:"29.PE.QUAD.REG.20",label:"Cromado · 20cm",tiers:[{minQty:1,label:"1",price:9.69}, {minQty:5,label:"5",price:8.69}, {minQty:10,label:"10",price:7.89}, {minQty:20,label:"20",price:7.09}],weight:"A consultar",ncm:"83024200"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"4.MOLA",
    slug:"4-mola",
    name:"Mola Leve Aérea para Portas | Até 25kg | Coimbra",
    description:"Mola Leve Aérea para Portas · Até 25kg · Coimbra · Ouro / Prata",
    category:"Ferragens",
    subcategory:"Molas Aéreas",
    brand:"Coimbra",
    supplier:"Coimbra",
    keywords:["mola aérea","mola leve aérea","mola para portas","até 25kg","25kg","coimbra","ouro","prata"],
    variations:[
      {sku:"4.MOLA.OU",label:"Ouro",tiers:[{minQty:1,label:"1",price:69.99}, {minQty:5,label:"5",price:68.99}, {minQty:10,label:"10",price:67.99}, {minQty:20,label:"20",price:65.99}],weight:"A consultar",ncm:"83026000"},
      {sku:"4.MOLA.PR",label:"Prata",tiers:[{minQty:1,label:"1",price:69.99}, {minQty:5,label:"5",price:68.99}, {minQty:10,label:"10",price:67.99}, {minQty:20,label:"20",price:65.99}],weight:"A consultar",ncm:"83026000"}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
  {
    prefix:"0.KIT.PF.BUC",
    slug:"0-kit-pf-buc",
    name:"Kit mão Francesa (Unitário)",
    description:"Kit mão Francesa (Unitário)",
    category:"Ferragens",
    subcategory:"Mãos Francesas",
    brand:"",
    supplier:"Grape Tools",
    keywords:["kit mão francesa (unitário)"],
    variations:[
      {sku:"0.KIT.PF.BUC.MF",label:"MF",tiers:[{minQty:1,label:"1",price:0.28}, {minQty:50,label:"50",price:0.25}, {minQty:100,label:"100",price:0.23}, {minQty:500,label:"500",price:0.2}],weight:"A consultar",ncm:""}
    ],
    stock:999,sold:0,isPromotion:false,isLaunch:false,
  },
];

// ============================================================
// KITS (compostos por outros produtos)
// Preço de cada variação = soma (quantidade × preço unitário base do componente).
// O ESTOQUE do kit não é fixo: é calculado dos componentes (ver lib/kit.ts) e a
// venda dá baixa nos componentes (ver lib/estoque.ts). Editar preços depois, se quiser.
// ============================================================

const _precoBasePorSku: Record<string, number> = {};
for (const _p of products) for (const _v of _p.variations) {
  _precoBasePorSku[_v.sku] = _v.tiers[0]?.price ?? 0;
}
function _precoUnit(sku: string): number { return _precoBasePorSku[sku] ?? 0; }
function _r2(n: number): number { return Math.round(n * 100) / 100; }
function _varsDoProduto(prefix: string): Variation[] {
  const p = products.find((pp) => pp.prefix === prefix);
  return p ? p.variations : [];
}
function _kitVar(sku: string, label: string, composicao: KitComponente[]): Variation {
  const preco = _r2(composicao.reduce((s, c) => s + c.quantidade * _precoUnit(c.sku), 0));
  return { sku, label, tiers: [{ minQty: 1, label: "1", price: preco }], weight: "A consultar", ncm: "", composicao };
}
function _kit(prefix: string, slug: string, name: string, subcategory: string, variations: Variation[]): Product {
  return {
    prefix, slug, name, description: name,
    category: "Kits", subcategory, brand: "Grape Tools", supplier: "Grape Tools",
    keywords: ["kit", ...name.toLowerCase().replace(/[|]/g, " ").split(/\s+/).filter(Boolean)],
    variations, stock: 999, sold: 0, isPromotion: false, isLaunch: false,
  };
}

const _kits: Product[] = [];
const _slug = (s: string) => s.toLowerCase().replace(/[._]+/g, "-");

// SKUs reais do GrapeOne (export grape-composicoes). Composição usa os SKUs do
// catálogo do site (pra preço e baixa de estoque baterem).

// 1) Mão francesa — 8 variações: 12 unidades + 24 kits de fixação (parafuso+bucha)
_kits.push(_kit("KIT.MAOF12", "kit-maof12", "Kit 12 Mãos Francesas com Fixação | Grape Tools", "Mãos Francesas",
  ([["BR", "Branca", "20"], ["BR", "Branca", "25"], ["BR", "Branca", "30"], ["BR", "Branca", "40"],
    ["PT", "Preta", "20"], ["PT", "Preta", "25"], ["PT", "Preta", "30"], ["PT", "Preta", "40"]] as const)
    .map(([c, nome, t]) => _kitVar(`14.MAOF.${c}.${t}_12`, `12x ${nome} ${t}cm`, [
      { sku: `14.MAOF.${c}.${t}`, quantidade: 12 }, { sku: "0.KIT.PF.BUC.MF", quantidade: 24 }]))));

// 2-7) Rodízios (metade com trava, metade sem)
const _rod: [string, string, number][] = [
  ["10.KIT.ROD.35_4", "35", 4], ["29.KIT.ROD.50_4", "50", 4],
  ["29.KIT.ROD.35_6", "35", 6], ["29.KIT.ROD.50_6", "50", 6],
  ["10.KIT.ROD.35_8", "35", 8], ["29.KIT.ROD.50_8", "50", 8],
];
for (const [sku, tam, n] of _rod) {
  const meta = n / 2;
  _kits.push(_kit(sku, _slug(sku), `Kit ${n} Rodízios ${tam}mm — ${meta} com trava + ${meta} sem trava`, "Rodízios",
    [_kitVar(sku, `${n} rodízios ${tam}mm`, [
      { sku: `29.ROD.COMT.${tam}`, quantidade: meta }, { sku: `29.ROD.SEMT.${tam}`, quantidade: meta }])]));
}

// 8) Termogel
_kits.push(_kit("9.KIT.BOLSA.PEQ.GRA", "kit-bolsa-peq-gra", "Kit Termogel — Pequena + Grande", "Bolsas Térmicas",
  [_kitVar("9.KIT.BOLSA.PEQ.GRA", "Pequena + Grande", [
    { sku: "9.BOLS.TER.GRA", quantidade: 1 }, { sku: "9.BOLS.TERM.PEQ", quantidade: 1 }])]));

// 9) Trava porta Cobrirel — 5x, 4 cores
_kits.push(_kit("1.KIT.TPOR.COBRIREL", "kit-tpor-cobrirel", "Kit 5 Travas de Porta Cobrirel", "Travas",
  ([["BR", "Branco"], ["CZ", "Cinza"], ["MR", "Marrom"], ["PT", "Preto"]] as const)
    .map(([c, nome]) => _kitVar(`1.TPOR.${c}_5`, `5x ${nome}`, [{ sku: `1.TPOR.${c}`, quantidade: 5 }]))));

// 10) Fecho rolete — 10x, Dourado e Zincado
_kits.push(_kit("CH.ROLET.KIT10", "kit-rolet-10", "Kit 10 Fechos Rolete | Grape Tools", "Fechos", [
  _kitVar("CH.ROLET.DO_10", "10x Dourado", [{ sku: "CH.ROLET.DO", quantidade: 10 }]),
  _kitVar("CH.ROLET.PR_10", "10x Zincado", [{ sku: "CH.ROLET.PR", quantidade: 10 }]),
]));

// 11) Conector de emenda — 30x, cinza/transparente
_kits.push(_kit("CH.CONEC.KIT30", "kit-conec-30", "Kit 30 Conectores de Emenda | Grape Tools", "Conectores", [
  _kitVar("CH.CONEC.DUP.CZ_30", "30x Cinza", [{ sku: "CH.CONEC.DUP.CZ", quantidade: 30 }]),
  _kitVar("CH.CONEC.LONG.TS_30", "30x Transparente", [{ sku: "CH.CONEC.LONG.TS", quantidade: 30 }]),
]));

// 12-15) Discos de lixa (por grão). Vermelho = CH.DISC.LIX.125; Branco = CH.DISC.125.BR
_kits.push(_kit("CH.DISC.LIX.125.KIT50", "kit-disc-vm-50", "Kit 50 Discos de Lixa Vermelho | Grape Tools", "Discos de Lixa",
  _varsDoProduto("CH.DISC.LIX.125").map((v) => _kitVar(`${v.sku}_50`, `50x ${v.label}`, [{ sku: v.sku, quantidade: 50 }]))));
_kits.push(_kit("CH.DISC.125.BR.KIT50", "kit-disc-br-50", "Kit 50 Discos de Lixa Branco | Grape Tools", "Discos de Lixa",
  _varsDoProduto("CH.DISC.125.BR").map((v) => _kitVar(`${v.sku}_50`, `50x ${v.label}`, [{ sku: v.sku, quantidade: 50 }]))));
_kits.push(_kit("0.M14.LIX.125.KIT30", "kit-m14-disc-vm-30", "Kit 30 Discos Vermelho + Suporte M14 | Grape Tools", "Discos de Lixa",
  _varsDoProduto("CH.DISC.LIX.125").map((v) => { const g = v.sku.slice("CH.DISC.LIX.125.".length); return _kitVar(`0.M14.LIX.125.${g}_30`, `30x ${v.label} + M14`, [{ sku: "4.M14.125", quantidade: 1 }, { sku: v.sku, quantidade: 30 }]); })));
_kits.push(_kit("0.M14.LIX.125.BR.KIT30", "kit-m14-disc-br-30", "Kit 30 Discos Branco + Suporte M14 | Grape Tools", "Discos de Lixa",
  _varsDoProduto("CH.DISC.125.BR").map((v) => { const g = v.sku.slice("CH.DISC.125.BR.".length); return _kitVar(`0.M14.LIX.125.BR.${g}_30`, `30x ${v.label} + M14`, [{ sku: "4.M14.125", quantidade: 1 }, { sku: v.sku, quantidade: 30 }]); })));

// 16) Pistão a gás — 2x, todas cores/forças
_kits.push(_kit("3.PIS.KIT2", "kit-pis-2", "Kit 2 Pistões a Gás com Amortecedor", "Pistões", [
  ..._varsDoProduto("3.PIS.BR").map((v) => _kitVar(`${v.sku}_2`, `2x ${v.label}`, [{ sku: v.sku, quantidade: 2 }])),
  ..._varsDoProduto("3.PIS.CZ").map((v) => _kitVar(`${v.sku}_2`, `2x ${v.label}`, [{ sku: v.sku, quantidade: 2 }])),
]));

// 17) Trilho 1m + 9 suportes BRANCO — 1 anúncio, variação por tamanho do suporte
_kits.push(_kit("14.KIT.3X100BR.SUP", "kit-trilho-suporte", "Kit 3 Trilhos 1m + 9 Suportes Branco", "Trilhos",
  ([["15", "14.KIT.3X100BR.9X15BR", "25.SUP.BR.15"],
    ["20", "14.KIT.3X100BR.9X20BR", "14.SUP.BR.20"],
    ["25", "14.KIT.3X100BR.9X25BR", "14.SUP.BR.25"],
    ["30", "14.KIT.3X100BR.9X30BR", "14.SUP.BR.30"]] as const)
    .map(([tam, sku, supSku]) => _kitVar(sku, `9 suportes ${tam}cm`, [
      { sku: "14.TS.BR.100", quantidade: 3 }, { sku: supSku, quantidade: 9 }]))));

// 18) Trilho 1m + 9 suportes PRETO — novo (trilho 25.TS.100.PT + suportes pretos)
_kits.push(_kit("25.KIT.3X100PT.SUP", "kit-trilho-suporte-preto", "Kit 3 Trilhos 1m + 9 Suportes Preto", "Trilhos",
  (["15", "20", "25", "30"] as const)
    .map((tam) => _kitVar(`25.KIT.3X100PT.9X${tam}PT`, `9 suportes ${tam}cm`, [
      { sku: "25.TS.100.PT", quantidade: 3 }, { sku: `25.SUP.PT.${tam}`, quantidade: 9 }]))));

// 20) Trava porta de metal (piso) Renna — 5x
_kits.push(_kit("3.TPOR.PISO_5", "kit-tpor-piso-5", "Kit 5 Travas de Porta de Piso Renna", "Travas",
  [_kitVar("3.TPOR.PISO_5", "5x Trava de piso", [{ sku: "3.TPOR.PISO", quantidade: 5 }])]));

// 21) Disco de polir + M14
_kits.push(_kit("4.KIT.DISC.POL.M14", "kit-disc-pol-m14", "Kit Disco de Polir + Suporte M14", "Discos de Lixa",
  [_kitVar("4.KIT.DISC.POL.M14", "Disco de polir + M14", [{ sku: "4.DISC.POL.5", quantidade: 1 }, { sku: "4.M14.125", quantidade: 1 }])]));

// 22) Fecho botão trinco — 10x, 2 cores
_kits.push(_kit("CH.TRAV.PIS.KIT10", "kit-trav-pis-10", "Kit 10 Fechos Botão Trinco | Grape Tools", "Fechos", [
  _kitVar("CH.TRAV.PIS.BR_10", "10x Branco", [{ sku: "CH.TRAV.PIS.BR", quantidade: 10 }]),
  _kitVar("CH.TRAV.PIS.PT_10", "10x Preto", [{ sku: "CH.TRAV.PIS.PT", quantidade: 10 }]),
]));

// 23) Fecho magnético com ímã — 8x
_kits.push(_kit("CH.FEC.MAGNET_8", "kit-fec-magnet-8", "Kit 8 Fechos Magnéticos com Ímã | Grape Tools", "Fechos",
  [_kitVar("CH.FEC.MAGNET_8", "8x Fecho magnético", [{ sku: "CH.FEC.MAGNET", quantidade: 8 }])]));

products.push(..._kits);

// Prefixos dos kits (usado na aba "KITS mais vendidos")
export const kitPrefixes: string[] = _kits.map((k) => k.prefix);

// Composição de um SKU de kit (ou null se não for kit)
export function composicaoDoSku(sku: string): KitComponente[] | null {
  for (const k of _kits) for (const v of k.variations) {
    if (v.sku === sku && v.composicao) return v.composicao;
  }
  return null;
}

export const categories: string[] = ["Abrasivos", "Elétrica", "Ferragens", "Ferramentas", "Fixação", "Kits", "Outros", "Utilidades"];
export const suppliers: string[] = ["Cobrirel", "Coimbra", "Disflex", "Duler", "Elgin", "FGVTN", "Fertak", "Grape Tools", "HD", "Idea", "Ivplast", "Jomarca", "Kian", "Metalnox", "Máxima", "Newfix", "Papaiz", "RCA", "Renna", "Sfor", "Sim", "Squadroni", "Starfer", "Storm", "São Raphael", "Tekbond", "Termogel", "USAF", "Utimix", "Veipar"];
export const brands: string[] = ["", "Cobrirel", "Coimbra", "Disflex", "Duler", "Elgin", "FGVTN", "Fertak", "Grape Tools", "HD", "Idea", "Ivplast", "Jomarca", "Kian", "Metalnox", "Máxima", "Newfix", "Papaiz", "RCA", "Renna", "Sfor", "Sim", "Squadroni", "Starfer", "Storm", "São Raphael", "Tekbond", "Termogel", "USAF", "Utimix", "Veipar"];
export const partnerBrands: string[] = ["Cobrirel", "Coimbra", "Disflex", "Duler", "Elgin", "FGVTN", "Fertak", "Grape Tools", "HD", "Idea", "Ivplast"];
export const adminModules: string[] = ["Produtos","Pedidos","Clientes","Estoque","Financeiro","Relatórios"];