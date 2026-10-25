(() => {
  const LOCALES = ['en', 'es', 'pt-br', 'ru', 'ar'];
  const META = {
    en: { label: 'English', lang: 'en', dir: 'ltr' },
    es: { label: 'Español', lang: 'es', dir: 'ltr' },
    'pt-br': { label: 'Português', lang: 'pt-BR', dir: 'ltr' },
    ru: { label: 'Русский', lang: 'ru', dir: 'ltr' },
    ar: { label: 'العربية', lang: 'ar', dir: 'rtl' }
  };

  // Product catalogue terms are kept separate from the static-page dictionary
  // so newly imported models can reuse the same professional terminology.
  const PRODUCT_TERMS = {
    es: {
      'Elastic Webbing': 'Cinta elástica', 'Silicone Grip Elastic': 'Elástico antideslizante de silicona', 'Fold Over Elastic': 'Elástico de ribete', 'Picot Elastic': 'Elástico picot', 'Plain Elastic': 'Elástico liso', 'Jacquard Elastic': 'Elástico jacquard', 'Printed Elastic': 'Elástico estampado', 'Embossed Elastic': 'Elástico con relieve', 'Debossed Elastic': 'Elástico grabado', 'Bra Strap Elastic': 'Elástico para tirantes de sujetador', 'Jacquard Bra Strap Elastic': 'Elástico jacquard para tirantes', 'Silicone Printed Elastic': 'Elástico estampado con silicona', 'Reflective Binding Elastic': 'Elástico reflectante de ribete',
      '46 mm Silicone Grip Elastic': 'Elástico antideslizante de silicona de 46 mm', '46 mm Ribbed Elastic Webbing': 'Cinta elástica acanalada de 46 mm', 'Metallic Star-and-Stripe Jacquard Elastic': 'Elástico jacquard metálico de estrellas y rayas', 'HAPPY Jacquard Elastic': 'Elástico jacquard HAPPY', 'BE PATIENT Printed Elastic': 'Elástico estampado BE PATIENT', 'SPOOKY BABE Silicone Printed Elastic': 'Elástico estampado con silicona SPOOKY BABE',
      'Nylon & Spandex': 'Nailon y elastano', 'Nylon & Latex': 'Nailon y látex', Nylon: 'Nailon', 'Polyester & Latex': 'Poliéster y látex', 'Polyester & Spandex': 'Poliéster y elastano', Polyester: 'Poliéster',
      'Apparel binding': 'Ribete para prendas', 'Bra and lingerie shoulder straps': 'Tirantes para sujetadores y lencería', 'Bra and shapewear underwire casing': 'Canal para aro de sujetadores y prendas moldeadoras', 'Bra bands and picot edging': 'Contornos de sujetador y ribetes picot', 'Bra bands, picot edging, and shoulder straps': 'Contornos de sujetador, ribetes picot y tirantes', 'Bras and underwear': 'Sujetadores y ropa interior', 'Cycling apparel straps': 'Tirantes para ropa de ciclismo', 'Cycling shorts leg openings': 'Bajos de pantalones de ciclismo', 'Elastic waistbands': 'Cinturillas elásticas', 'Football, basketball, and sportswear waistbands': 'Cinturillas para fútbol, baloncesto y ropa deportiva', 'Lingerie & Intimate Apparel': 'Lencería y ropa íntima', 'Lingerie Shoulder Straps & Intimate Apparel': 'Tirantes de lencería y ropa íntima', 'Lingerie Shoulder Straps & Lace Underwear Waistbands': 'Tirantes de lencería y cinturillas para ropa interior de encaje', 'Mesh elastic trims': 'Acabados elásticos de malla', 'Non-slip elastic applications': 'Aplicaciones elásticas antideslizantes', 'Outdoor and activewear binding': 'Ribetes para prendas de exterior y deportivas', 'Sportswear waistbands': 'Cinturillas para ropa deportiva', "Women's underwear waist and leg openings": 'Cinturas y aberturas de pierna para ropa interior femenina', "Women's underwear waistbands": 'Cinturillas para ropa interior femenina',
      'Color matching': 'Igualación de color', 'Width and stretch': 'Ancho y elasticidad', 'Logo or pattern': 'Logo o diseño', 'Roll and carton packing': 'Embalaje en rollos y cajas',
      Activewear: 'Ropa deportiva', Binding: 'Ribete', 'Bra Strap': 'Tirante de sujetador', 'Decorative Edge': 'Borde decorativo', Embossed: 'Relieve', 'Fold Over': 'Ribete plegable', Jacquard: 'Jacquard', Lurex: 'Hilo metálico', Picot: 'Picot', Plain: 'Liso', Printed: 'Estampado', Reflective: 'Reflectante', 'Silicone Grip': 'Silicona antideslizante', Waistband: 'Cinturilla',
      'Product Display': 'Vistas del producto', 'Front & Back': 'Anverso y reverso', Front: 'Anverso', Back: 'Reverso', Colors: 'Colores', 'Click thumbnails to view available product angles.': 'Haga clic en las miniaturas para ver los ángulos disponibles.', 'Buyer-focused product features and fabric parameters for quotation review.': 'Características y parámetros del producto para revisar la cotización.', 'Product specifications': 'Especificaciones del producto', 'Customize Your Elastic': 'Personalice su elástico', 'Color Matching': 'Igualación de color', 'Stretch To Spec': 'Elasticidad según especificación', 'Send width, color, logo artwork, target quantity, and garment application for a faster quotation.': 'Envíe el ancho, color, archivo del logo, cantidad prevista y aplicación para recibir una cotización más rápida.'
    },
    'pt-br': {
      'Elastic Webbing': 'Fita elástica', 'Silicone Grip Elastic': 'Elástico com silicone antiderrapante', 'Fold Over Elastic': 'Elástico de debrum', 'Picot Elastic': 'Elástico picot', 'Plain Elastic': 'Elástico liso', 'Jacquard Elastic': 'Elástico jacquard', 'Printed Elastic': 'Elástico estampado', 'Embossed Elastic': 'Elástico em alto-relevo', 'Debossed Elastic': 'Elástico em baixo-relevo', 'Bra Strap Elastic': 'Elástico para alça de sutiã', 'Jacquard Bra Strap Elastic': 'Elástico jacquard para alça de sutiã', 'Silicone Printed Elastic': 'Elástico estampado com silicone', 'Reflective Binding Elastic': 'Elástico refletivo para debrum',
      '46 mm Silicone Grip Elastic': 'Elástico antiderrapante de silicone de 46 mm', '46 mm Ribbed Elastic Webbing': 'Fita elástica canelada de 46 mm', 'Metallic Star-and-Stripe Jacquard Elastic': 'Elástico jacquard metálico de estrelas e listras', 'HAPPY Jacquard Elastic': 'Elástico jacquard HAPPY', 'BE PATIENT Printed Elastic': 'Elástico estampado BE PATIENT', 'SPOOKY BABE Silicone Printed Elastic': 'Elástico estampado com silicone SPOOKY BABE',
      'Nylon & Spandex': 'Náilon e elastano', 'Nylon & Latex': 'Náilon e látex', Nylon: 'Náilon', 'Polyester & Latex': 'Poliéster e látex', 'Polyester & Spandex': 'Poliéster e elastano', Polyester: 'Poliéster',
      'Apparel binding': 'Debrum para vestuário', 'Bra and lingerie shoulder straps': 'Alças para sutiãs e lingerie', 'Bra and shapewear underwire casing': 'Canaleta para aro de sutiã e modeladores', 'Bra bands and picot edging': 'Faixas de sutiã e acabamento picot', 'Bra bands, picot edging, and shoulder straps': 'Faixas de sutiã, acabamento picot e alças', 'Bras and underwear': 'Sutiãs e roupa íntima', 'Cycling apparel straps': 'Alças para vestuário de ciclismo', 'Cycling shorts leg openings': 'Barras de shorts de ciclismo', 'Elastic waistbands': 'Cós elásticos', 'Football, basketball, and sportswear waistbands': 'Cós para futebol, basquete e moda esportiva', 'Lingerie & Intimate Apparel': 'Lingerie e roupa íntima', 'Lingerie Shoulder Straps & Intimate Apparel': 'Alças de lingerie e roupa íntima', 'Lingerie Shoulder Straps & Lace Underwear Waistbands': 'Alças de lingerie e cós para roupa íntima de renda', 'Mesh elastic trims': 'Acabamentos elásticos em tela', 'Non-slip elastic applications': 'Aplicações elásticas antiderrapantes', 'Outdoor and activewear binding': 'Debrum para roupas outdoor e esportivas', 'Sportswear waistbands': 'Cós para moda esportiva', "Women's underwear waist and leg openings": 'Cinturas e aberturas de perna para roupa íntima feminina', "Women's underwear waistbands": 'Cós para roupa íntima feminina',
      'Color matching': 'Correspondência de cores', 'Width and stretch': 'Largura e elasticidade', 'Logo or pattern': 'Logo ou desenho', 'Roll and carton packing': 'Embalagem em rolos e caixas',
      Activewear: 'Moda fitness', Binding: 'Debrum', 'Bra Strap': 'Alça de sutiã', 'Decorative Edge': 'Borda decorativa', Embossed: 'Alto-relevo', 'Fold Over': 'Debrum dobrável', Jacquard: 'Jacquard', Lurex: 'Fio metálico', Picot: 'Picot', Plain: 'Liso', Printed: 'Estampado', Reflective: 'Refletivo', 'Silicone Grip': 'Silicone antiderrapante', Waistband: 'Cós',
      'Product Display': 'Vistas do produto', 'Front & Back': 'Frente e verso', Front: 'Frente', Back: 'Verso', Colors: 'Cores', 'Click thumbnails to view available product angles.': 'Clique nas miniaturas para ver os ângulos disponíveis.', 'Buyer-focused product features and fabric parameters for quotation review.': 'Características e parâmetros do produto para análise da cotação.', 'Product specifications': 'Especificações do produto', 'Customize Your Elastic': 'Personalize seu elástico', 'Color Matching': 'Correspondência de cores', 'Stretch To Spec': 'Elasticidade conforme especificação', 'Send width, color, logo artwork, target quantity, and garment application for a faster quotation.': 'Envie largura, cor, arquivo do logo, quantidade desejada e aplicação para receber uma cotação mais rápida.'
    },
    ru: {
      'Elastic Webbing': 'Эластичная лента', 'Silicone Grip Elastic': 'Эластичная лента с противоскользящим силиконом', 'Fold Over Elastic': 'Окантовочная эластичная лента', 'Picot Elastic': 'Эластичная лента с пико', 'Plain Elastic': 'Гладкая эластичная лента', 'Jacquard Elastic': 'Жаккардовая эластичная лента', 'Printed Elastic': 'Эластичная лента с печатью', 'Embossed Elastic': 'Рельефная эластичная лента', 'Debossed Elastic': 'Эластичная лента с тиснением', 'Bra Strap Elastic': 'Эластичная лента для бретелей', 'Jacquard Bra Strap Elastic': 'Жаккардовая лента для бретелей', 'Silicone Printed Elastic': 'Эластичная лента с силиконовой печатью', 'Reflective Binding Elastic': 'Светоотражающая окантовочная лента',
      '46 mm Silicone Grip Elastic': 'Эластичная лента 46 мм с противоскользящим силиконом', '46 mm Ribbed Elastic Webbing': 'Рубчатая эластичная лента 46 мм', 'Metallic Star-and-Stripe Jacquard Elastic': 'Жаккардовая лента с металлизированными звездами и полосами', 'HAPPY Jacquard Elastic': 'Жаккардовая лента HAPPY', 'BE PATIENT Printed Elastic': 'Лента с печатью BE PATIENT', 'SPOOKY BABE Silicone Printed Elastic': 'Лента с силиконовой печатью SPOOKY BABE',
      'Nylon & Spandex': 'Нейлон и спандекс', 'Nylon & Latex': 'Нейлон и латекс', Nylon: 'Нейлон', 'Polyester & Latex': 'Полиэстер и латекс', 'Polyester & Spandex': 'Полиэстер и спандекс', Polyester: 'Полиэстер',
      'Apparel binding': 'Окантовка одежды', 'Bra and lingerie shoulder straps': 'Бретели для бюстгальтеров и белья', 'Bra and shapewear underwire casing': 'Туннельная лента для косточек бюстгальтеров и корсетного белья', 'Bra bands and picot edging': 'Пояса бюстгальтеров и отделка пико', 'Bra bands, picot edging, and shoulder straps': 'Пояса бюстгальтеров, отделка пико и бретели', 'Bras and underwear': 'Бюстгальтеры и нижнее белье', 'Cycling apparel straps': 'Бретели для велоодежды', 'Cycling shorts leg openings': 'Манжеты велошорт', 'Elastic waistbands': 'Эластичные пояса', 'Football, basketball, and sportswear waistbands': 'Пояса для футбольной, баскетбольной и спортивной одежды', 'Lingerie & Intimate Apparel': 'Белье и интимная одежда', 'Lingerie Shoulder Straps & Intimate Apparel': 'Бретели для белья и интимная одежда', 'Lingerie Shoulder Straps & Lace Underwear Waistbands': 'Бретели для белья и пояса для кружевного белья', 'Mesh elastic trims': 'Эластичная сетчатая отделка', 'Non-slip elastic applications': 'Нескользящие эластичные изделия', 'Outdoor and activewear binding': 'Окантовка для уличной и спортивной одежды', 'Sportswear waistbands': 'Пояса для спортивной одежды', "Women's underwear waist and leg openings": 'Пояса и вырезы для ног женского белья', "Women's underwear waistbands": 'Пояса для женского белья',
      'Color matching': 'Подбор цвета', 'Width and stretch': 'Ширина и растяжимость', 'Logo or pattern': 'Логотип или узор', 'Roll and carton packing': 'Упаковка в рулоны и коробки',
      Activewear: 'Спортивная одежда', Binding: 'Окантовка', 'Bra Strap': 'Бретель', 'Decorative Edge': 'Декоративный край', Embossed: 'Рельеф', 'Fold Over': 'Окантовочная', Jacquard: 'Жаккард', Lurex: 'Металлизированная нить', Picot: 'Пико', Plain: 'Гладкая', Printed: 'Печать', Reflective: 'Светоотражающая', 'Silicone Grip': 'Противоскользящий силикон', Waistband: 'Пояс',
      'Product Display': 'Виды изделия', 'Front & Back': 'Лицевая и изнаночная стороны', Front: 'Лицевая сторона', Back: 'Изнаночная сторона', Colors: 'Цвета', 'Click thumbnails to view available product angles.': 'Нажмите на миниатюры, чтобы посмотреть доступные ракурсы.', 'Buyer-focused product features and fabric parameters for quotation review.': 'Характеристики и параметры для подготовки ценового предложения.', 'Product specifications': 'Характеристики товара', 'Customize Your Elastic': 'Настройте эластичную ленту', 'Color Matching': 'Подбор цвета', 'Stretch To Spec': 'Растяжимость по техзаданию', 'Send width, color, logo artwork, target quantity, and garment application for a faster quotation.': 'Укажите ширину, цвет, макет логотипа, количество и применение для быстрого расчёта.'
    },
    ar: {
      'Elastic Webbing': 'شريط مطاطي', 'Silicone Grip Elastic': 'شريط مطاطي سيليكون مانع للانزلاق', 'Fold Over Elastic': 'شريط مطاطي للحواف', 'Picot Elastic': 'شريط مطاطي بيكو', 'Plain Elastic': 'شريط مطاطي سادة', 'Jacquard Elastic': 'شريط مطاطي جاكارد', 'Printed Elastic': 'شريط مطاطي مطبوع', 'Embossed Elastic': 'شريط مطاطي بنقش بارز', 'Debossed Elastic': 'شريط مطاطي بنقش غائر', 'Bra Strap Elastic': 'شريط مطاطي لحمالات الصدر', 'Jacquard Bra Strap Elastic': 'شريط جاكارد مطاطي لحمالات الصدر', 'Silicone Printed Elastic': 'شريط مطاطي مطبوع بالسيليكون', 'Reflective Binding Elastic': 'شريط حواف مطاطي عاكس',
      '46 mm Silicone Grip Elastic': 'شريط سيليكون مطاطي مانع للانزلاق بعرض 46 مم', '46 mm Ribbed Elastic Webbing': 'شريط مطاطي مضلع بعرض 46 مم', 'Metallic Star-and-Stripe Jacquard Elastic': 'شريط جاكارد معدني بنجوم وخطوط', 'HAPPY Jacquard Elastic': 'شريط جاكارد HAPPY', 'BE PATIENT Printed Elastic': 'شريط مطبوع BE PATIENT', 'SPOOKY BABE Silicone Printed Elastic': 'شريط سيليكون مطبوع SPOOKY BABE',
      'Nylon & Spandex': 'نايلون وسباندكس', 'Nylon & Latex': 'نايلون ولاتكس', Nylon: 'نايلون', 'Polyester & Latex': 'بوليستر ولاتكس', 'Polyester & Spandex': 'بوليستر وسباندكس', Polyester: 'بوليستر',
      'Apparel binding': 'حواف الملابس', 'Bra and lingerie shoulder straps': 'حمالات الصدر والملابس الداخلية', 'Bra and shapewear underwire casing': 'قناة سلك حمالات الصدر وملابس تشكيل الجسم', 'Bra bands and picot edging': 'أحزمة حمالات الصدر وحواف بيكو', 'Bra bands, picot edging, and shoulder straps': 'أحزمة حمالات الصدر وحواف بيكو والحمالات', 'Bras and underwear': 'حمالات الصدر والملابس الداخلية', 'Cycling apparel straps': 'حمالات ملابس ركوب الدراجات', 'Cycling shorts leg openings': 'فتحات أرجل سراويل ركوب الدراجات', 'Elastic waistbands': 'أحزمة خصر مطاطية', 'Football, basketball, and sportswear waistbands': 'أحزمة خصر لكرة القدم والسلة والملابس الرياضية', 'Lingerie & Intimate Apparel': 'اللانجري والملابس الداخلية', 'Lingerie Shoulder Straps & Intimate Apparel': 'حمالات اللانجري والملابس الداخلية', 'Lingerie Shoulder Straps & Lace Underwear Waistbands': 'حمالات اللانجري وأحزمة خصر للملابس الداخلية الدانتيل', 'Mesh elastic trims': 'حواف مطاطية شبكية', 'Non-slip elastic applications': 'تطبيقات مطاطية مانعة للانزلاق', 'Outdoor and activewear binding': 'حواف للملابس الخارجية والرياضية', 'Sportswear waistbands': 'أحزمة خصر للملابس الرياضية', "Women's underwear waist and leg openings": 'خصر وفتحات أرجل الملابس الداخلية النسائية', "Women's underwear waistbands": 'أحزمة خصر للملابس الداخلية النسائية',
      'Color matching': 'مطابقة الألوان', 'Width and stretch': 'العرض والتمدد', 'Logo or pattern': 'الشعار أو النقشة', 'Roll and carton packing': 'تعبئة بكرات وكراتين',
      Activewear: 'ملابس رياضية', Binding: 'حواف', 'Bra Strap': 'حمالة صدر', 'Decorative Edge': 'حافة زخرفية', Embossed: 'نقش بارز', 'Fold Over': 'حواف قابلة للطي', Jacquard: 'جاكارد', Lurex: 'خيط معدني', Picot: 'بيكو', Plain: 'سادة', Printed: 'مطبوع', Reflective: 'عاكس', 'Silicone Grip': 'سيليكون مانع للانزلاق', Waistband: 'حزام خصر',
      'Product Display': 'عرض المنتج', 'Front & Back': 'الوجه والظهر', Front: 'الوجه', Back: 'الظهر', Colors: 'الألوان', 'Click thumbnails to view available product angles.': 'انقر على الصور المصغرة لعرض زوايا المنتج المتاحة.', 'Buyer-focused product features and fabric parameters for quotation review.': 'خصائص المنتج ومعلماته لمراجعة عرض السعر.', 'Product specifications': 'مواصفات المنتج', 'Customize Your Elastic': 'خصص شريطك المطاطي', 'Color Matching': 'مطابقة الألوان', 'Stretch To Spec': 'التمدد حسب المواصفات', 'Send width, color, logo artwork, target quantity, and garment application for a faster quotation.': 'أرسل العرض واللون وملف الشعار والكمية المطلوبة والتطبيق للحصول على عرض سعر أسرع.'
    }
  };

  const PRODUCT_TEMPLATES = {
    es: {
      intro: (type, application) => `${type} para ${application}, disponible con desarrollo personalizado de color, ancho, elasticidad, logo y embalaje.`,
      count: count => `${count} soluciones elásticas`,
      need: name => `¿Necesita ${name} con los detalles de su marca?`
    },
    'pt-br': {
      intro: (type, application) => `${type} para ${application}, disponível com desenvolvimento personalizado de cor, largura, elasticidade, logo e embalagem.`,
      count: count => `${count} soluções elásticas`,
      need: name => `Precisa de ${name} com os detalhes da sua marca?`
    },
    ru: {
      intro: (type, application) => `${type} для ${application}; цвет, ширина, растяжимость, логотип и упаковка изготавливаются по требованиям заказчика.`,
      count: count => `${count} варианта(ов) эластичных лент`,
      need: name => `Нужен ${name} с параметрами вашего бренда?`
    },
    ar: {
      intro: (type, application) => `${type} لـ ${application}، مع إمكانية تخصيص اللون والعرض والتمدد والشعار والتعبئة.`,
      count: count => `${count} حلاً مطاطياً`,
      need: name => `هل تحتاج إلى ${name} بتفاصيل علامتك التجارية؟`
    }
  };

  const STRINGS = {
    es: {
      HOME: 'INICIO', PRODUCTS: 'PRODUCTOS', 'CUSTOM SOLUTIONS': 'SOLUCIONES A MEDIDA', FACTORY: 'FÁBRICA', EXHIBITIONS: 'FERIAS', 'ABOUT US': 'NOSOTROS', CONTACT: 'CONTACTO',
      Home: 'Inicio', Products: 'Productos', 'Custom Solutions': 'Soluciones a medida', Factory: 'Fábrica', Contact: 'Contacto', 'Quick Links': 'Enlaces rápidos',
      'View Products': 'Ver productos', 'Request Samples': 'Solicitar muestras', 'Start Inquiry': 'Enviar consulta', 'Get Quote': 'Solicitar cotización', 'Request A Quote': 'Solicitar cotización',
      'Product Catalog': 'Catálogo de productos', 'Elastic Webbing Products': 'Cintas elásticas para confección', 'Main Categories': 'Categorías principales', 'Product Tags': 'Tipos de producto', 'All Tags': 'Todos los tipos', All: 'Todos',
      "Men's Underwear Elastics": 'Elásticos para ropa interior masculina', "Women's Underwear Elastics": 'Elásticos para ropa interior femenina', 'Bra & Lingerie Elastics': 'Elásticos para sujetadores y lencería', 'Activewear Elastics': 'Elásticos para ropa deportiva',
      'View Details': 'Ver detalles', 'Product Details': 'Detalles del producto', Features: 'Características', Specifications: 'Especificaciones', Gallery: 'Galería',
      'Custom Your Design': 'Personalice su diseño', 'Custom Logo': 'Logo personalizado', 'Custom Color': 'Color personalizado', 'Custom Width': 'Ancho personalizado', 'Custom Packing': 'Embalaje personalizado', 'Request Quote': 'Solicitar cotización',
      'Soft Comfort': 'Comodidad suave', 'Vivid Color': 'Color intenso', 'High Elasticity': 'Alta elasticidad',
      Width: 'Ancho', Material: 'Material', Printing: 'Impresión', Handfeel: 'Tacto', Color: 'Color', Elasticity: 'Elasticidad', Usage: 'Aplicación', Packing: 'Embalaje', 'Item No.': 'N.º de artículo',
      'Contact Sales': 'Contactar con ventas', 'Send Inquiry': 'Enviar consulta', 'Full Name *': 'Nombre completo *', 'Email Address *': 'Correo electrónico *', 'Phone / WhatsApp': 'Teléfono / WhatsApp', 'Product Interest': 'Producto de interés', 'Target Quantity': 'Cantidad prevista', 'Message *': 'Mensaje *',
      'Global Distributor Partnerships': 'Alianzas globales con distribuidores', 'Become A Huagui Elastic Partner In Your Market': 'Sea socio de Huagui Elastic en su mercado', 'Looking For Local Distributors, Wholesalers And Agents': 'Buscamos distribuidores locales, mayoristas y agentes', 'Discuss A Partnership': 'Hablar de una colaboración',
      'Company Name *': 'Nombre de la empresa *', 'Country / Region *': 'País / Región *', 'Business Role *': 'Tipo de empresa *', 'Select your role': 'Seleccione su función', Distributor: 'Distribuidor', Wholesaler: 'Mayorista', 'Sales Agent': 'Agente comercial', Importer: 'Importador', 'Intimate Apparel Manufacturer': 'Fabricante de ropa íntima', 'Brand / Buying Office': 'Marca / Oficina de compras', Other: 'Otro',
      'Preferred Trade Term': 'Incoterm preferido', 'Need Advice': 'Necesito asesoramiento', 'Quote Currency': 'Moneda de cotización', 'Either USD or CNY': 'USD o CNY', 'Global WhatsApp & WeChat': 'WhatsApp global y WeChat', 'Global WhatsApp': 'WhatsApp global', WeChat: 'WeChat',
      'English-language sales support': 'Atención comercial en inglés', 'Samples are free when the customer agrees to pay courier charges': 'Las muestras son gratuitas si el cliente acepta pagar el envío por mensajería', 'Free when the customer agrees to pay courier charges': 'Gratis si el cliente acepta pagar el envío por mensajería', 'EXW standard; FOB on request': 'EXW estándar; FOB a solicitud', 'Quotes in USD or CNY': 'Cotizaciones en USD o CNY',
      'Select a category': 'Seleccione una categoría', 'Other / Multiple': 'Otro / Varios', 'Helpful Inquiry Details': 'Datos útiles para la consulta', 'What To Send For A Faster Quote': 'Qué enviar para recibir una cotización más rápida',
      Application: 'Aplicación', Specification: 'Especificación', Reference: 'Referencia', 'Order Plan': 'Plan del pedido',
      'About Huagui': 'Sobre Huagui', 'Why Choose Us': 'Por qué elegirnos', 'Development Flow': 'Proceso de desarrollo', 'Quality Control': 'Control de calidad', 'Production Focus': 'Enfoque de producción',
      'Dyeing Capability': 'Capacidad de tintura', 'Continuous And Package Dyeing In One Factory': 'Tintura continua y en paquete dentro de una sola fábrica', 'In-House Dyeing': 'Tintura propia', 'Continuous Dyeing': 'Tintura continua', 'Package Dyeing': 'Tintura en paquete', 'Color Review': 'Control del color',
      'Different elastic constructions and order requirements can be matched with continuous dyeing or package dyeing processes, supporting color development and repeat-order control.': 'Las distintas estructuras elásticas y necesidades de pedido pueden combinarse con procesos de tintura continua o en paquete para desarrollar colores y controlar los pedidos repetidos.',
      'No published products are available yet.': 'Todavía no hay productos publicados.', 'Product Not Found': 'Producto no encontrado', 'View Products': 'Ver productos',
      'Underwear Elastics Built For Your Brand': 'Elásticos para ropa interior creados para su marca', 'Color, Width, Texture, Packaging': 'Color, ancho, textura y embalaje', 'Elastic Details That Make Garments Feel Better': 'Elásticos que mejoran el ajuste y la comodidad de la prenda',
      'Elastic Products For Intimate Apparel Brands': 'Elásticos para marcas de ropa íntima', 'Built For Repeat Orders': 'Preparados para pedidos recurrentes', 'Popular Elastic Solutions': 'Soluciones elásticas destacadas', 'From Elastic Idea To Production-Ready Sample': 'De la idea a una muestra lista para producción',
      'Elastic Development For Intimate Apparel Teams': 'Desarrollo de elásticos para equipos de ropa íntima', 'Elastic Production With Repeat-Order Consistency': 'Producción de elásticos con calidad constante en cada pedido', 'Product Boards For Buyer Meetings': 'Muestrarios de producto para reuniones con compradores', 'Focused On Elastic Webbing For Intimate Apparel': 'Especialistas en cintas elásticas para ropa íntima', 'Request Samples Or Quotation': 'Solicite muestras o una cotización',
      'Printed Waistbands': 'Cinturillas elásticas estampadas', 'Jacquard Logo Waistbands': 'Cinturillas jacquard con logo', "Women's Printed Waistbands": 'Cinturillas estampadas para mujer', 'Plain Underwear Elastic': 'Elástico liso para ropa interior', 'Fold Over Elastic': 'Elástico bies', 'Picot Lingerie Elastic': 'Elástico picot para lencería', 'Silicone Grip Elastic': 'Elástico antideslizante de silicona', 'Bra Strap Elastic': 'Elástico para tirantes de sujetador', 'Activewear Binding Elastic': 'Elástico de ribete para ropa deportiva'
    },
    'pt-br': {
      HOME: 'INÍCIO', PRODUCTS: 'PRODUTOS', 'CUSTOM SOLUTIONS': 'SOLUÇÕES SOB MEDIDA', FACTORY: 'FÁBRICA', EXHIBITIONS: 'FEIRAS', 'ABOUT US': 'SOBRE NÓS', CONTACT: 'CONTATO',
      Home: 'Início', Products: 'Produtos', 'Custom Solutions': 'Soluções sob medida', Factory: 'Fábrica', Contact: 'Contato', 'Quick Links': 'Links rápidos',
      'View Products': 'Ver produtos', 'Request Samples': 'Solicitar amostras', 'Start Inquiry': 'Enviar consulta', 'Get Quote': 'Solicitar cotação', 'Request A Quote': 'Solicitar cotação',
      'Product Catalog': 'Catálogo de produtos', 'Elastic Webbing Products': 'Fitas elásticas para vestuário', 'Main Categories': 'Categorias principais', 'Product Tags': 'Tipos de produto', 'All Tags': 'Todos os tipos', All: 'Todos',
      "Men's Underwear Elastics": 'Elásticos para roupa íntima masculina', "Women's Underwear Elastics": 'Elásticos para roupa íntima feminina', 'Bra & Lingerie Elastics': 'Elásticos para sutiãs e lingerie', 'Activewear Elastics': 'Elásticos para moda fitness',
      'View Details': 'Ver detalhes', 'Product Details': 'Detalhes do produto', Features: 'Características', Specifications: 'Especificações', Gallery: 'Galeria',
      'Custom Your Design': 'Personalize seu design', 'Custom Logo': 'Logo personalizado', 'Custom Color': 'Cor personalizada', 'Custom Width': 'Largura personalizada', 'Custom Packing': 'Embalagem personalizada', 'Request Quote': 'Solicitar cotação',
      'Soft Comfort': 'Conforto macio', 'Vivid Color': 'Cor viva', 'High Elasticity': 'Alta elasticidade',
      Width: 'Largura', Material: 'Material', Printing: 'Estampa', Handfeel: 'Toque', Color: 'Cor', Elasticity: 'Elasticidade', Usage: 'Aplicação', Packing: 'Embalagem', 'Item No.': 'Código do produto',
      'Contact Sales': 'Falar com vendas', 'Send Inquiry': 'Enviar consulta', 'Full Name *': 'Nome completo *', 'Email Address *': 'E-mail *', 'Phone / WhatsApp': 'Telefone / WhatsApp', 'Product Interest': 'Produto de interesse', 'Target Quantity': 'Quantidade desejada', 'Message *': 'Mensagem *',
      'Global Distributor Partnerships': 'Parcerias globais com distribuidores', 'Become A Huagui Elastic Partner In Your Market': 'Seja parceiro da Huagui Elastic no seu mercado', 'Looking For Local Distributors, Wholesalers And Agents': 'Procuramos distribuidores locais, atacadistas e agentes', 'Discuss A Partnership': 'Falar sobre parceria',
      'Company Name *': 'Nome da empresa *', 'Country / Region *': 'País / Região *', 'Business Role *': 'Tipo de empresa *', 'Select your role': 'Selecione sua função', Distributor: 'Distribuidor', Wholesaler: 'Atacadista', 'Sales Agent': 'Agente comercial', Importer: 'Importador', 'Intimate Apparel Manufacturer': 'Fabricante de roupa íntima', 'Brand / Buying Office': 'Marca / Escritório de compras', Other: 'Outro',
      'Preferred Trade Term': 'Termo comercial preferido', 'Need Advice': 'Preciso de orientação', 'Quote Currency': 'Moeda da cotação', 'Either USD or CNY': 'USD ou CNY', 'Global WhatsApp & WeChat': 'WhatsApp global e WeChat', 'Global WhatsApp': 'WhatsApp global', WeChat: 'WeChat',
      'English-language sales support': 'Atendimento comercial em inglês', 'Samples are free when the customer agrees to pay courier charges': 'As amostras são gratuitas se o cliente concordar em pagar o frete por courier', 'Free when the customer agrees to pay courier charges': 'Grátis se o cliente concordar em pagar o frete por courier', 'EXW standard; FOB on request': 'EXW padrão; FOB sob solicitação', 'Quotes in USD or CNY': 'Cotações em USD ou CNY',
      'Select a category': 'Selecione uma categoria', 'Other / Multiple': 'Outro / Vários', 'Helpful Inquiry Details': 'Informações úteis para cotação', 'What To Send For A Faster Quote': 'O que enviar para receber uma cotação mais rápida',
      Application: 'Aplicação', Specification: 'Especificação', Reference: 'Referência', 'Order Plan': 'Plano do pedido',
      'About Huagui': 'Sobre a Huagui', 'Why Choose Us': 'Por que nos escolher', 'Development Flow': 'Fluxo de desenvolvimento', 'Quality Control': 'Controle de qualidade', 'Production Focus': 'Foco da produção',
      'Dyeing Capability': 'Capacidade de tingimento', 'Continuous And Package Dyeing In One Factory': 'Tingimento contínuo e em pacote na mesma fábrica', 'In-House Dyeing': 'Tingimento próprio', 'Continuous Dyeing': 'Tingimento contínuo', 'Package Dyeing': 'Tingimento em pacote', 'Color Review': 'Controle de cor',
      'Different elastic constructions and order requirements can be matched with continuous dyeing or package dyeing processes, supporting color development and repeat-order control.': 'Diferentes estruturas elásticas e necessidades de pedido podem ser atendidas com tingimento contínuo ou em pacote, apoiando o desenvolvimento de cores e o controle de pedidos recorrentes.',
      'No published products are available yet.': 'Ainda não há produtos publicados.', 'Product Not Found': 'Produto não encontrado',
      'Underwear Elastics Built For Your Brand': 'Elásticos para roupa íntima desenvolvidos para sua marca', 'Color, Width, Texture, Packaging': 'Cor, largura, textura e embalagem', 'Elastic Details That Make Garments Feel Better': 'Elásticos que melhoram o ajuste e o conforto da peça',
      'Elastic Products For Intimate Apparel Brands': 'Elásticos para marcas de roupa íntima', 'Built For Repeat Orders': 'Preparados para pedidos recorrentes', 'Popular Elastic Solutions': 'Soluções elásticas em destaque', 'From Elastic Idea To Production-Ready Sample': 'Da ideia à amostra pronta para produção',
      'Elastic Development For Intimate Apparel Teams': 'Desenvolvimento de elásticos para equipes de roupa íntima', 'Elastic Production With Repeat-Order Consistency': 'Produção de elásticos com qualidade consistente em cada pedido', 'Product Boards For Buyer Meetings': 'Mostruários para reuniões com compradores', 'Focused On Elastic Webbing For Intimate Apparel': 'Especialistas em fitas elásticas para roupa íntima', 'Request Samples Or Quotation': 'Solicite amostras ou cotação',
      'Printed Waistbands': 'Elásticos estampados para cós', 'Jacquard Logo Waistbands': 'Elásticos jacquard com logo', "Women's Printed Waistbands": 'Elásticos estampados femininos', 'Plain Underwear Elastic': 'Elástico liso para roupa íntima', 'Fold Over Elastic': 'Elástico de debrum', 'Picot Lingerie Elastic': 'Elástico picot para lingerie', 'Silicone Grip Elastic': 'Elástico com silicone antiderrapante', 'Bra Strap Elastic': 'Elástico para alça de sutiã', 'Activewear Binding Elastic': 'Elástico de acabamento para moda fitness'
    },
    ru: {
      HOME: 'ГЛАВНАЯ', PRODUCTS: 'ПРОДУКЦИЯ', 'CUSTOM SOLUTIONS': 'ИЗГОТОВЛЕНИЕ НА ЗАКАЗ', FACTORY: 'ПРОИЗВОДСТВО', EXHIBITIONS: 'ВЫСТАВКИ', 'ABOUT US': 'О КОМПАНИИ', CONTACT: 'КОНТАКТЫ',
      Home: 'Главная', Products: 'Продукция', 'Custom Solutions': 'Изготовление на заказ', Factory: 'Производство', Contact: 'Контакты', 'Quick Links': 'Быстрые ссылки',
      'View Products': 'Смотреть продукцию', 'Request Samples': 'Запросить образцы', 'Start Inquiry': 'Отправить запрос', 'Get Quote': 'Запросить цену', 'Request A Quote': 'Запросить цену',
      'Product Catalog': 'Каталог продукции', 'Elastic Webbing Products': 'Эластичные ленты для одежды', 'Main Categories': 'Основные категории', 'Product Tags': 'Типы продукции', 'All Tags': 'Все типы', All: 'Все',
      "Men's Underwear Elastics": 'Резинки для мужского белья', "Women's Underwear Elastics": 'Резинки для женского белья', 'Bra & Lingerie Elastics': 'Резинки для бюстгальтеров и белья', 'Activewear Elastics': 'Резинки для спортивной одежды',
      'View Details': 'Подробнее', 'Product Details': 'Описание товара', Features: 'Преимущества', Specifications: 'Характеристики', Gallery: 'Галерея',
      'Custom Your Design': 'Изготовим по вашему дизайну', 'Custom Logo': 'Ваш логотип', 'Custom Color': 'Ваш цвет', 'Custom Width': 'Нужная ширина', 'Custom Packing': 'Индивидуальная упаковка', 'Request Quote': 'Запросить цену',
      'Soft Comfort': 'Мягкость и комфорт', 'Vivid Color': 'Стойкий цвет', 'High Elasticity': 'Высокая эластичность',
      Width: 'Ширина', Material: 'Материал', Printing: 'Печать', Handfeel: 'Тактильные свойства', Color: 'Цвет', Elasticity: 'Эластичность', Usage: 'Применение', Packing: 'Упаковка', 'Item No.': 'Артикул',
      'Contact Sales': 'Связаться с отделом продаж', 'Send Inquiry': 'Отправить запрос', 'Full Name *': 'Имя и фамилия *', 'Email Address *': 'Электронная почта *', 'Phone / WhatsApp': 'Телефон / WhatsApp', 'Product Interest': 'Интересующая продукция', 'Target Quantity': 'Планируемое количество', 'Message *': 'Сообщение *',
      'Global Distributor Partnerships': 'Глобальное партнерство с дистрибьюторами', 'Become A Huagui Elastic Partner In Your Market': 'Станьте партнером Huagui Elastic на вашем рынке', 'Looking For Local Distributors, Wholesalers And Agents': 'Ищем местных дистрибьюторов, оптовиков и агентов', 'Discuss A Partnership': 'Обсудить партнерство',
      'Company Name *': 'Название компании *', 'Country / Region *': 'Страна / Регион *', 'Business Role *': 'Тип компании *', 'Select your role': 'Выберите тип компании', Distributor: 'Дистрибьютор', Wholesaler: 'Оптовик', 'Sales Agent': 'Торговый агент', Importer: 'Импортер', 'Intimate Apparel Manufacturer': 'Производитель нижнего белья', 'Brand / Buying Office': 'Бренд / Закупочный офис', Other: 'Другое',
      'Preferred Trade Term': 'Предпочтительный базис поставки', 'Need Advice': 'Нужна консультация', 'Quote Currency': 'Валюта предложения', 'Either USD or CNY': 'USD или CNY', 'Global WhatsApp & WeChat': 'Единые WhatsApp и WeChat', 'Global WhatsApp': 'Единый WhatsApp', WeChat: 'WeChat',
      'English-language sales support': 'Отдел продаж отвечает на английском', 'Samples are free when the customer agrees to pay courier charges': 'Образцы бесплатны при согласии клиента оплатить курьерскую доставку', 'Free when the customer agrees to pay courier charges': 'Бесплатно при согласии клиента оплатить курьерскую доставку', 'EXW standard; FOB on request': 'Стандартно EXW; FOB по запросу', 'Quotes in USD or CNY': 'Предложения в USD или CNY',
      'Select a category': 'Выберите категорию', 'Other / Multiple': 'Другое / Несколько', 'Helpful Inquiry Details': 'Данные для запроса', 'What To Send For A Faster Quote': 'Что указать для быстрого расчёта',
      Application: 'Применение', Specification: 'Характеристики', Reference: 'Образец', 'Order Plan': 'План заказа',
      'About Huagui': 'О Huagui', 'Why Choose Us': 'Почему выбирают нас', 'Development Flow': 'Этапы разработки', 'Quality Control': 'Контроль качества', 'Production Focus': 'Производственные возможности',
      'Dyeing Capability': 'Возможности крашения', 'Continuous And Package Dyeing In One Factory': 'Непрерывное и паковочное крашение на одной фабрике', 'In-House Dyeing': 'Собственное крашение', 'Continuous Dyeing': 'Непрерывное крашение', 'Package Dyeing': 'Паковочное крашение', 'Color Review': 'Контроль цвета',
      'Different elastic constructions and order requirements can be matched with continuous dyeing or package dyeing processes, supporting color development and repeat-order control.': 'Для разных конструкций эластичной ленты и требований заказа применяются процессы непрерывного или паковочного крашения, что помогает разрабатывать цвета и контролировать повторные заказы.',
      'No published products are available yet.': 'Опубликованных товаров пока нет.', 'Product Not Found': 'Товар не найден',
      'Underwear Elastics Built For Your Brand': 'Бельевые резинки для вашего бренда', 'Color, Width, Texture, Packaging': 'Цвет, ширина, фактура и упаковка', 'Elastic Details That Make Garments Feel Better': 'Эластичные детали для комфорта и правильной посадки',
      'Elastic Products For Intimate Apparel Brands': 'Эластичные ленты для брендов нижнего белья', 'Built For Repeat Orders': 'Стабильное качество для повторных заказов', 'Popular Elastic Solutions': 'Популярные решения', 'From Elastic Idea To Production-Ready Sample': 'От идеи до образца, готового к производству',
      'Elastic Development For Intimate Apparel Teams': 'Разработка эластичных лент для производителей нижнего белья', 'Elastic Production With Repeat-Order Consistency': 'Стабильное производство для повторных заказов', 'Product Boards For Buyer Meetings': 'Образцы продукции для встреч с покупателями', 'Focused On Elastic Webbing For Intimate Apparel': 'Специализация на эластичных лентах для нижнего белья', 'Request Samples Or Quotation': 'Запросить образцы или расчёт цены',
      'Printed Waistbands': 'Печатные резинки для пояса', 'Jacquard Logo Waistbands': 'Жаккардовые поясные резинки с логотипом', "Women's Printed Waistbands": 'Печатные резинки для женского белья', 'Plain Underwear Elastic': 'Однотонная бельевая резинка', 'Fold Over Elastic': 'Окантовочная эластичная лента', 'Picot Lingerie Elastic': 'Ажурная резинка пико для белья', 'Silicone Grip Elastic': 'Эластичная лента с силиконовым покрытием', 'Bra Strap Elastic': 'Эластичная лента для бретелей', 'Activewear Binding Elastic': 'Окантовочная резинка для спортивной одежды'
    },
    ar: {
      HOME: 'الرئيسية', PRODUCTS: 'المنتجات', 'CUSTOM SOLUTIONS': 'حلول مخصصة', FACTORY: 'المصنع', EXHIBITIONS: 'المعارض', 'ABOUT US': 'من نحن', CONTACT: 'اتصل بنا',
      Home: 'الرئيسية', Products: 'المنتجات', 'Custom Solutions': 'حلول مخصصة', Factory: 'المصنع', Contact: 'اتصل بنا', 'Quick Links': 'روابط سريعة',
      'View Products': 'عرض المنتجات', 'Request Samples': 'طلب عينات', 'Start Inquiry': 'إرسال استفسار', 'Get Quote': 'طلب عرض سعر', 'Request A Quote': 'طلب عرض سعر',
      'Product Catalog': 'كتالوج المنتجات', 'Elastic Webbing Products': 'أشرطة مطاطية للملابس', 'Main Categories': 'الفئات الرئيسية', 'Product Tags': 'أنواع المنتجات', 'All Tags': 'كل الأنواع', All: 'الكل',
      "Men's Underwear Elastics": 'مطاط للملابس الداخلية الرجالية', "Women's Underwear Elastics": 'مطاط للملابس الداخلية النسائية', 'Bra & Lingerie Elastics': 'مطاط لحمالات الصدر واللانجري', 'Activewear Elastics': 'مطاط للملابس الرياضية',
      'View Details': 'عرض التفاصيل', 'Product Details': 'تفاصيل المنتج', Features: 'المميزات', Specifications: 'المواصفات', Gallery: 'معرض الصور',
      'Custom Your Design': 'خصص تصميمك', 'Custom Logo': 'شعار مخصص', 'Custom Color': 'لون مخصص', 'Custom Width': 'عرض مخصص', 'Custom Packing': 'تغليف مخصص', 'Request Quote': 'طلب عرض سعر',
      'Soft Comfort': 'نعومة وراحة', 'Vivid Color': 'لون ثابت وواضح', 'High Elasticity': 'مرونة عالية',
      Width: 'العرض', Material: 'الخامة', Printing: 'الطباعة', Handfeel: 'الملمس', Color: 'اللون', Elasticity: 'المرونة', Usage: 'الاستخدام', Packing: 'التغليف', 'Item No.': 'رقم الصنف',
      'Contact Sales': 'التواصل مع المبيعات', 'Send Inquiry': 'إرسال الاستفسار', 'Full Name *': 'الاسم الكامل *', 'Email Address *': 'البريد الإلكتروني *', 'Phone / WhatsApp': 'الهاتف / واتساب', 'Product Interest': 'المنتج المطلوب', 'Target Quantity': 'الكمية المطلوبة', 'Message *': 'الرسالة *',
      'Global Distributor Partnerships': 'شراكات الموزعين العالمية', 'Become A Huagui Elastic Partner In Your Market': 'كن شريك Huagui Elastic في سوقك', 'Looking For Local Distributors, Wholesalers And Agents': 'نبحث عن موزعين وتجار جملة ووكلاء محليين', 'Discuss A Partnership': 'ناقش فرصة الشراكة',
      'Company Name *': 'اسم الشركة *', 'Country / Region *': 'الدولة / المنطقة *', 'Business Role *': 'نوع النشاط *', 'Select your role': 'اختر نوع نشاطك', Distributor: 'موزع', Wholesaler: 'تاجر جملة', 'Sales Agent': 'وكيل مبيعات', Importer: 'مستورد', 'Intimate Apparel Manufacturer': 'مصنع ملابس داخلية', 'Brand / Buying Office': 'علامة تجارية / مكتب شراء', Other: 'أخرى',
      'Preferred Trade Term': 'شرط التجارة المفضل', 'Need Advice': 'أحتاج إلى مشورة', 'Quote Currency': 'عملة عرض السعر', 'Either USD or CNY': 'الدولار أو اليوان', 'Global WhatsApp & WeChat': 'واتساب وWeChat العالميان', 'Global WhatsApp': 'واتساب العالمي', WeChat: 'WeChat',
      'English-language sales support': 'دعم مبيعات باللغة الإنجليزية', 'Samples are free when the customer agrees to pay courier charges': 'العينات مجانية إذا وافق العميل على دفع رسوم الشحن السريع', 'Free when the customer agrees to pay courier charges': 'مجانًا إذا وافق العميل على دفع رسوم الشحن السريع', 'EXW standard; FOB on request': 'EXW هو الأساس؛ وFOB عند الطلب', 'Quotes in USD or CNY': 'عروض الأسعار بالدولار أو اليوان',
      'Select a category': 'اختر فئة', 'Other / Multiple': 'أخرى / عدة منتجات', 'Helpful Inquiry Details': 'معلومات مفيدة للاستفسار', 'What To Send For A Faster Quote': 'ما الذي ترسله للحصول على عرض أسرع',
      Application: 'الاستخدام', Specification: 'المواصفات', Reference: 'المرجع', 'Order Plan': 'خطة الطلب',
      'About Huagui': 'عن Huagui', 'Why Choose Us': 'لماذا تختارنا', 'Development Flow': 'مراحل التطوير', 'Quality Control': 'مراقبة الجودة', 'Production Focus': 'قدرات الإنتاج',
      'Dyeing Capability': 'قدرات الصباغة', 'Continuous And Package Dyeing In One Factory': 'الصباغة المستمرة وصباغة العبوات في مصنع واحد', 'In-House Dyeing': 'صباغة داخلية', 'Continuous Dyeing': 'الصباغة المستمرة', 'Package Dyeing': 'صباغة العبوات', 'Color Review': 'مراجعة اللون',
      'Different elastic constructions and order requirements can be matched with continuous dyeing or package dyeing processes, supporting color development and repeat-order control.': 'يمكن ملاءمة تراكيب الأشرطة المطاطية ومتطلبات الطلب المختلفة مع الصباغة المستمرة أو صباغة العبوات لدعم تطوير الألوان وضبط الطلبات المتكررة.',
      'No published products are available yet.': 'لا توجد منتجات منشورة حالياً.', 'Product Not Found': 'المنتج غير موجود',
      'Underwear Elastics Built For Your Brand': 'أشرطة مطاطية للملابس الداخلية مصممة لعلامتك التجارية', 'Color, Width, Texture, Packaging': 'اللون والعرض والملمس والتغليف', 'Elastic Details That Make Garments Feel Better': 'تفاصيل مطاطية تمنح الملابس راحة وملاءمة أفضل',
      'Elastic Products For Intimate Apparel Brands': 'منتجات مطاطية لعلامات الملابس الداخلية', 'Built For Repeat Orders': 'جودة ثابتة للطلبات المتكررة', 'Popular Elastic Solutions': 'حلول مطاطية مختارة', 'From Elastic Idea To Production-Ready Sample': 'من الفكرة إلى عينة جاهزة للإنتاج',
      'Elastic Development For Intimate Apparel Teams': 'تطوير الأشرطة المطاطية لشركات الملابس الداخلية', 'Elastic Production With Repeat-Order Consistency': 'إنتاج ثابت الجودة للطلبات المتكررة', 'Product Boards For Buyer Meetings': 'لوحات عينات لاجتماعات المشترين', 'Focused On Elastic Webbing For Intimate Apparel': 'متخصصون في الأشرطة المطاطية للملابس الداخلية', 'Request Samples Or Quotation': 'اطلب عينات أو عرض سعر',
      'Printed Waistbands': 'مطاط خصر مطبوع', 'Jacquard Logo Waistbands': 'مطاط خصر جاكار بالشعار', "Women's Printed Waistbands": 'مطاط خصر نسائي مطبوع', 'Plain Underwear Elastic': 'مطاط سادة للملابس الداخلية', 'Fold Over Elastic': 'شريط مطاطي للحواف', 'Picot Lingerie Elastic': 'مطاط بيكو للانجري', 'Silicone Grip Elastic': 'مطاط مانع للانزلاق بالسيليكون', 'Bra Strap Elastic': 'مطاط لحمالات الصدر', 'Activewear Binding Elastic': 'مطاط حواف للملابس الرياضية'
    }
  };

  const COMMON_STRINGS = {
    es: {
      FAQ: 'PREGUNTAS FRECUENTES', 'Buyer FAQ': 'Preguntas frecuentes para compradores', 'Privacy Policy': 'Política de privacidad', 'Binding & Edge Elastics': 'Elásticos para ribetes y bordes',
      'Custom Underwear Elastic Manufacturer': 'Fabricante de elásticos personalizados para ropa interior', 'Exhibitions': 'Ferias internacionales', 'About Us': 'Quiénes somos', 'Elastic Webbing Buyer FAQ': 'Preguntas frecuentes sobre cintas elásticas', Address: 'Dirección',
      'Custom elastic webbing manufacturer for underwear, lingerie, bras, and intimate apparel brands.': 'Fabricante de cintas elásticas personalizadas para marcas de ropa interior, lencería y sujetadores.',
      'Printed, jacquard, plain, fold over, picot, knitted, binding, and bra strap elastic solutions.': 'Soluciones elásticas estampadas, jacquard, lisas, de ribete, picot, tejidas y para tirantes de sujetador.',
      'New factory and product Reels published daily.': 'Publicamos a diario nuevos Reels de fábrica y productos.',
      'Sample and bulk order support': 'Atención para muestras y pedidos al por mayor',
      'No. 1 Jintian Road, Xiashan, Chaonan District, Shantou, Guangdong, China': 'N.º 1, Jintian Road, Xiashan, distrito de Chaonan, Shantou, Guangdong, China',
      '© 2026 Huagui Elastic. Custom elastic webbing for global intimate apparel brands.': '© 2026 Huagui Elastic. Cintas elásticas personalizadas para marcas internacionales de ropa íntima.'
    },
    'pt-br': {
      FAQ: 'PERGUNTAS FREQUENTES', 'Buyer FAQ': 'Perguntas frequentes para compradores', 'Privacy Policy': 'Política de privacidade', 'Binding & Edge Elastics': 'Elásticos para debrum e bordas',
      'Custom Underwear Elastic Manufacturer': 'Fabricante de elásticos personalizados para roupa íntima', 'Exhibitions': 'Feiras internacionais', 'About Us': 'Sobre nós', 'Elastic Webbing Buyer FAQ': 'Perguntas frequentes sobre fitas elásticas', Address: 'Endereço',
      'Custom elastic webbing manufacturer for underwear, lingerie, bras, and intimate apparel brands.': 'Fabricante de fitas elásticas personalizadas para marcas de roupa íntima, lingerie e sutiãs.',
      'Printed, jacquard, plain, fold over, picot, knitted, binding, and bra strap elastic solutions.': 'Soluções elásticas estampadas, jacquard, lisas, para debrum, picot, tricotadas e para alças de sutiã.',
      'New factory and product Reels published daily.': 'Novos Reels da fábrica e dos produtos publicados diariamente.',
      'Sample and bulk order support': 'Atendimento para amostras e pedidos em volume',
      'No. 1 Jintian Road, Xiashan, Chaonan District, Shantou, Guangdong, China': 'N.º 1, Jintian Road, Xiashan, distrito de Chaonan, Shantou, Guangdong, China',
      '© 2026 Huagui Elastic. Custom elastic webbing for global intimate apparel brands.': '© 2026 Huagui Elastic. Fitas elásticas personalizadas para marcas globais de moda íntima.'
    },
    ru: {
      FAQ: 'ВОПРОСЫ И ОТВЕТЫ', 'Buyer FAQ': 'Вопросы покупателей', 'Privacy Policy': 'Политика конфиденциальности', 'Binding & Edge Elastics': 'Окантовочные и краевые эластичные ленты',
      'Custom Underwear Elastic Manufacturer': 'Производитель эластичных лент для нижнего белья на заказ', 'Exhibitions': 'Международные выставки', 'About Us': 'О компании', 'Elastic Webbing Buyer FAQ': 'Вопросы покупателей об эластичных лентах', Address: 'Адрес',
      'Custom elastic webbing manufacturer for underwear, lingerie, bras, and intimate apparel brands.': 'Производитель эластичных лент на заказ для брендов нижнего белья, бюстгальтеров и интимной одежды.',
      'Printed, jacquard, plain, fold over, picot, knitted, binding, and bra strap elastic solutions.': 'Эластичные ленты с печатью, жаккардовые, гладкие, окантовочные, пико, вязаные и для бретелей.',
      'New factory and product Reels published daily.': 'Ежедневно публикуем новые Reels о фабрике и продукции.',
      'Sample and bulk order support': 'Поддержка по образцам и оптовым заказам',
      'No. 1 Jintian Road, Xiashan, Chaonan District, Shantou, Guangdong, China': 'Китай, провинция Гуандун, г. Шаньтоу, район Чаонань, Сяшань, ул. Цзиньтянь, 1',
      '© 2026 Huagui Elastic. Custom elastic webbing for global intimate apparel brands.': '© 2026 Huagui Elastic. Эластичные ленты на заказ для мировых брендов нижнего белья.'
    },
    ar: {
      FAQ: 'الأسئلة الشائعة', 'Buyer FAQ': 'أسئلة المشترين الشائعة', 'Privacy Policy': 'سياسة الخصوصية', 'Binding & Edge Elastics': 'أشرطة مطاطية للحواف والتشطيب',
      'Custom Underwear Elastic Manufacturer': 'مصنع أشرطة مطاطية مخصصة للملابس الداخلية', 'Exhibitions': 'المعارض الدولية', 'About Us': 'من نحن', 'Elastic Webbing Buyer FAQ': 'أسئلة المشترين عن الأشرطة المطاطية', Address: 'العنوان',
      'Custom elastic webbing manufacturer for underwear, lingerie, bras, and intimate apparel brands.': 'مصنع أشرطة مطاطية مخصصة لعلامات الملابس الداخلية واللانجري وحمالات الصدر.',
      'Printed, jacquard, plain, fold over, picot, knitted, binding, and bra strap elastic solutions.': 'حلول مطاطية مطبوعة وجاكارد وسادة وللحواف وبيكو ومحبوكة ولحمالات الصدر.',
      'New factory and product Reels published daily.': 'ننشر يوميًا مقاطع Reels جديدة عن المصنع والمنتجات.',
      'Sample and bulk order support': 'دعم العينات والطلبات بالجملة',
      'No. 1 Jintian Road, Xiashan, Chaonan District, Shantou, Guangdong, China': 'رقم 1، طريق جينتيان، شياشان، منطقة تشاونان، شانتو، غوانغدونغ، الصين',
      '© 2026 Huagui Elastic. Custom elastic webbing for global intimate apparel brands.': '© 2026 Huagui Elastic. أشرطة مطاطية مخصصة لعلامات الملابس الداخلية العالمية.'
    }
  };

  function localeFromPath() {
    const first = location.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
    if (LOCALES.includes(first)) return first;
    if (['localhost', '127.0.0.1'].includes(location.hostname)) {
      const previewLocale = new URLSearchParams(location.search).get('lang')?.toLowerCase();
      if (LOCALES.includes(previewLocale)) return previewLocale;
    }
    return 'en';
  }

  const locale = localeFromPath();
  const config = META[locale];
  const dictionary = {
    ...(window.HUAGUI_LEAF_TRANSLATIONS?.[locale] || {}),
    ...(window.HUAGUI_PAGE_TRANSLATIONS?.[locale] || {}),
    ...(STRINGS[locale] || {}),
    ...(COMMON_STRINGS[locale] || {})
  };
  const productTerms = PRODUCT_TERMS[locale] || {};
  const productTemplates = PRODUCT_TEMPLATES[locale] || {};
  const productTermsLower = new Map(Object.entries(productTerms).map(([key, value]) => [key.toLowerCase(), value]));
  const isLocalPreview = ['localhost', '127.0.0.1'].includes(location.hostname);
  document.documentElement.lang = config.lang;
  document.documentElement.dir = config.dir;
  document.documentElement.dataset.locale = locale;

  function localizedPath(targetLocale) {
    const parts = location.pathname.split('/').filter(Boolean);
    if (LOCALES.includes(parts[0])) parts.shift();
    const suffix = parts.length ? `/${parts.join('/')}` : '/';
    return targetLocale === 'en' ? suffix : `/${targetLocale}${suffix}`;
  }

  function productTerm(value) {
    const text = String(value ?? '').trim();
    return productTerms[text] || productTermsLower.get(text.toLowerCase()) || '';
  }

  function preserveEmailAddresses(source, translated) {
    const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
    const sourceEmails = String(source).match(emailPattern) || [];
    let index = 0;
    return String(translated).replace(emailPattern, match => sourceEmails[index++] || match);
  }

  function translateValue(value) {
    const text = String(value ?? '');
    if (locale === 'en' || !text) return text;
    if (dictionary[text]) return preserveEmailAddresses(text, dictionary[text]);
    const exact = productTerm(text);
    if (exact) return exact;

    const namedProduct = text.match(/^(.+?)\s+\|\s+(.+)$/);
    if (namedProduct) {
      const translatedType = productTerm(namedProduct[2]);
      if (translatedType) return `${namedProduct[1]} | ${translatedType}`;
    }

    if (text.includes(' / ')) {
      const parts = text.split(' / ');
      const localizedParts = parts.map(part => productTerm(part) || part);
      if (localizedParts.some((part, index) => part !== parts[index])) return localizedParts.join(' / ');
    }

    const intro = text.match(/^(.+?) for (.+?), available for buyer-specific color, width, stretch, logo, and packing development\.$/i);
    if (intro && productTemplates.intro) {
      return productTemplates.intro(productTerm(intro[1]) || intro[1], productTerm(intro[2]) || intro[2]);
    }

    const count = text.match(/^(\d+) elastic solutions$/i);
    if (count && productTemplates.count) return productTemplates.count(count[1]);

    const need = text.match(/^Need (.+) With Your Brand Details\?$/i);
    if (need && productTemplates.need) return productTemplates.need(translateValue(need[1]));

    const labeledValue = text.match(/^([^:]{1,40}):\s*(.+)$/);
    if (labeledValue) {
      const label = dictionary[labeledValue[1]] || productTerm(labeledValue[1]) || labeledValue[1];
      const translated = translateValue(labeledValue[2]);
      if (label !== labeledValue[1] || translated !== labeledValue[2]) return `${label}: ${translated}`;
    }

    return text;
  }

  function setOrCreateLink(rel, hreflang, href) {
    const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
    let link = document.head.querySelector(selector);
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      if (hreflang) link.hreflang = hreflang;
      document.head.appendChild(link);
    }
    link.href = new URL(href, location.origin).href;
  }

  function setupSeoLinks() {
    const suffix = location.search;
    setOrCreateLink('canonical', '', `${localizedPath(locale)}${suffix}`);
    LOCALES.forEach(code => setOrCreateLink('alternate', META[code].lang, `${localizedPath(code)}${suffix}`));
    setOrCreateLink('alternate', 'x-default', `${localizedPath('en')}${suffix}`);
  }

  function translateText(root = document.body) {
    if (locale === 'en' || !root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const tag = node.parentElement?.tagName;
        if (!node.nodeValue.trim() || ['SCRIPT', 'STYLE', 'TEXTAREA'].includes(tag)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const raw = node.nodeValue;
      const text = raw.trim();
      const translated = translateValue(text);
      if (translated === text) return;
      node.nodeValue = raw.replace(text, translated);
    });
  }

  function localizeLinks(root = document) {
    if (locale === 'en') return;
    root.querySelectorAll?.('a[href]').forEach(anchor => {
      const raw = anchor.getAttribute('href');
      if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:') || /^https?:\/\//i.test(raw)) return;
      const url = new URL(raw, location.origin);
      if (isLocalPreview) {
        url.searchParams.set('lang', locale);
        anchor.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
        return;
      }
      const parts = url.pathname.split('/').filter(Boolean);
      if (!LOCALES.includes(parts[0]) && !url.pathname.startsWith('/api/')) url.pathname = `/${locale}/${parts.join('/')}`;
      anchor.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
    });
  }

  function injectLanguageSwitcher() {
    const nav = document.querySelector('.navbar .container');
    if (!nav || nav.querySelector('.language-switcher')) return;
    const wrapper = document.createElement('label');
    wrapper.className = 'language-switcher';
    wrapper.setAttribute('aria-label', 'Language');
    wrapper.innerHTML = `<span aria-hidden="true">🌐</span><select aria-label="Language">${LOCALES.map(code => `<option value="${code}"${code === locale ? ' selected' : ''}>${META[code].label}</option>`).join('')}</select>`;
    wrapper.querySelector('select').addEventListener('change', event => {
      if (isLocalPreview) {
        const url = new URL(location.href);
        if (event.target.value === 'en') url.searchParams.delete('lang');
        else url.searchParams.set('lang', event.target.value);
        location.href = url.href;
      } else {
        location.href = `${localizedPath(event.target.value)}${location.search}${location.hash}`;
      }
    });
    nav.insertBefore(wrapper, nav.querySelector('.navbar-toggle'));
  }

  function translateMetadata() {
    if (locale === 'en') return;
    const titleProduct = document.title.match(/^Huagui Elastic - (.+)$/);
    if (titleProduct) document.title = `Huagui Elastic - ${translateValue(titleProduct[1])}`;
    const brandedTitle = document.title.match(/^(.+?)\s+\|\s+Huagui Elastic$/);
    if (brandedTitle) document.title = `${translateValue(brandedTitle[1])} | Huagui Elastic`;
  }

  function apply(root = document) {
    translateText(root === document ? document.body : root);
    localizeLinks(root === document ? document : root);
    injectLanguageSwitcher();
    translateMetadata();
  }

  setupSeoLinks();
  document.addEventListener('DOMContentLoaded', () => {
    apply(document);
    const observer = new MutationObserver(records => {
      records.forEach(record => record.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) apply(node);
        else if (node.nodeType === Node.TEXT_NODE) translateText(node.parentElement);
      }));
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });

  window.HUAGUI_I18N = { locale, meta: META, translate: translateValue, localizedPath };
})();
