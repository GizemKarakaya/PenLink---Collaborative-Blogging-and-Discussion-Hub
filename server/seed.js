const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Category = require('./models/Category');
const Post = require('./models/Post');
const Tag = require('./models/Tag');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/penlink';

// Sample data
const categories = [
  { name: 'Teknoloji', description: 'En son teknoloji haberleri ve incelemeleri' },
  { name: 'Tasarım', description: 'UI/UX tasarım trendleri ve ipuçları' },
  { name: 'Geliştirme', description: 'Web ve mobil geliştirme rehberleri' },
  { name: 'İş Dünyası', description: 'Girişimcilik ve iş dünyası stratejileri' }
];

const posts = [
  {
    title: 'Modern Web Geliştirmede En İyi Pratikler',
    content: `2024 yılında web geliştirme dünyasında dikkat edilmesi gereken önemli noktalar ve en iyi pratikler.

Web geliştirme sürekli gelişen bir alan. Modern framework'ler, yeni araçlar ve best practice'ler her gün ortaya çıkıyor. Bu yazıda, 2024 yılında web geliştirmede dikkat edilmesi gereken en önemli noktaları ele alacağız.

## Performans Optimizasyonu

Performans, modern web uygulamalarının en kritik faktörlerinden biridir. Kullanıcılar yavaş yüklenen sayfalardan hızla uzaklaşır. Bu nedenle:

- Code splitting kullanın
- Lazy loading implementasyonu yapın
- Image optimization'a dikkat edin
- CDN kullanımını değerlendirin

## Güvenlik

Güvenlik her zaman öncelikli olmalıdır. XSS, CSRF gibi saldırılara karşı önlemler alınmalıdır.`,
    excerpt: '2024 yılında web geliştirme dünyasında dikkat edilmesi gereken önemli noktalar ve en iyi pratikler.',
    tags: ['React', 'JavaScript', 'Web Development'],
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop'
  },
  {
    title: 'UI/UX Tasarımda Kullanıcı Deneyimi',
    content: `Kullanıcı deneyimini ön planda tutarak etkili arayüz tasarımları nasıl oluşturulur?

UI/UX tasarım, sadece güzel görünmekle ilgili değildir. Kullanıcının ihtiyaçlarını anlamak ve onlara en iyi deneyimi sunmak esastır.

## Kullanıcı Odaklı Tasarım

Kullanıcı odaklı tasarım, kullanıcının ihtiyaçlarını, hedeflerini ve davranışlarını anlamakla başlar. Bu süreçte:

- User research yapın
- Persona oluşturun
- User journey mapping yapın
- Prototipleme ve test etme süreçlerini ihmal etmeyin

## Erişilebilirlik

Erişilebilirlik, tüm kullanıcıların web sitenizi kullanabilmesi anlamına gelir. WCAG standartlarına uygun tasarım yapın.`,
    excerpt: 'Kullanıcı deneyimini ön planda tutarak etkili arayüz tasarımları nasıl oluşturulur?',
    tags: ['UI/UX', 'Design', 'User Experience'],
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=250&fit=crop'
  },
  {
    title: 'Yapay Zeka ve Geleceğin Teknolojileri',
    content: `Yapay zeka teknolojilerinin gelecekteki etkileri ve yazılım geliştirme süreçlerine katkıları.

Yapay zeka, yazılım geliştirme dünyasını köklü bir şekilde değiştiriyor. ChatGPT, GitHub Copilot gibi araçlar geliştiricilerin iş akışını hızlandırıyor.

## AI'ın Geliştirme Süreçlerine Etkisi

- Code generation ve autocomplete
- Bug detection ve fixing
- Test automation
- Documentation generation

## Gelecek Öngörüleri

Yapay zeka teknolojileri, gelecekte yazılım geliştirme süreçlerini daha da otomatikleştirecek. Ancak insan faktörü her zaman önemli kalacak.`,
    excerpt: 'Yapay zeka teknolojilerinin gelecekteki etkileri ve yazılım geliştirme süreçlerine katkıları.',
    tags: ['AI', 'Machine Learning', 'Future Tech'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop'
  },
  {
    title: 'Startup Dünyasında Başarı Hikayeleri',
    content: `Başarılı startup girişimlerinin ortak özellikleri ve başarıya giden yolda dikkat edilmesi gerekenler.

Startup dünyası zorlu ama heyecan verici bir yolculuk. Başarılı startup'ların ortak özelliklerini inceleyelim.

## Başarı Faktörleri

- Güçlü bir ekip
- Pazar ihtiyacını doğru anlama
- Hızlı iterasyon
- Müşteri odaklı yaklaşım

## Yaygın Hatalar

- Pazar araştırması yapmamak
- Çok erken ölçeklenmeye çalışmak
- Müşteri geri bildirimlerini görmezden gelmek`,
    excerpt: 'Başarılı startup girişimlerinin ortak özellikleri ve başarıya giden yolda dikkat edilmesi gerekenler.',
    tags: ['Startup', 'Entrepreneurship', 'Success'],
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop'
  },
  {
    title: 'Node.js ile Backend Geliştirme',
    content: `Node.js kullanarak modern backend uygulamaları geliştirme teknikleri ve en iyi pratikler.

Node.js, JavaScript'in server-side'da kullanılmasını sağlayan güçlü bir platformdur. Modern backend geliştirmede önemli bir yere sahiptir.

## Node.js Avantajları

- Tek dil (JavaScript) ile full-stack geliştirme
- Yüksek performans
- Zengin ekosistem (npm)
- Asenkron programlama desteği

## Best Practices

- Error handling'e dikkat edin
- Middleware kullanımını öğrenin
- Security best practices'i uygulayın
- Testing'i ihmal etmeyin`,
    excerpt: 'Node.js kullanarak modern backend uygulamaları geliştirme teknikleri ve en iyi pratikler.',
    tags: ['Node.js', 'Backend', 'JavaScript'],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop'
  }
];

async function seedDatabase() {
  try {
    console.log('🔄 MongoDB bağlantısı kuruluyor...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB bağlantısı başarılı!');

    // Clear existing data
    console.log('🗑️  Mevcut veriler temizleniyor...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Post.deleteMany({});
    await Tag.deleteMany({});

    // Create admin user
    console.log('👤 Admin kullanıcı oluşturuluyor...');
    const adminUser = new User({
      username: 'admin',
      email: 'admin@penlink.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('✅ Admin kullanıcı oluşturuldu (admin@penlink.com / admin123)');

    // Create regular user
    console.log('👤 Normal kullanıcı oluşturuluyor...');
    const regularUser = new User({
      username: 'testuser',
      email: 'user@example.com',
      password: 'user123',
      role: 'user'
    });
    await regularUser.save();
    console.log('✅ Normal kullanıcı oluşturuldu (user@example.com / user123)');

    // Create categories
    console.log('📁 Kategoriler oluşturuluyor...');
    const createdCategories = [];
    for (const cat of categories) {
      const category = new Category(cat);
      await category.save();
      createdCategories.push(category);
      console.log(`   ✓ ${cat.name} kategorisi oluşturuldu`);
    }

    // Create posts
    console.log('📝 Blog yazıları oluşturuluyor...');
    const categoryMap = {
      'Geliştirme': createdCategories.find(c => c.name === 'Geliştirme'),
      'Tasarım': createdCategories.find(c => c.name === 'Tasarım'),
      'Teknoloji': createdCategories.find(c => c.name === 'Teknoloji'),
      'İş Dünyası': createdCategories.find(c => c.name === 'İş Dünyası')
    };

    const postCategoryMap = [
      categoryMap['Geliştirme'],
      categoryMap['Tasarım'],
      categoryMap['Teknoloji'],
      categoryMap['İş Dünyası'],
      categoryMap['Geliştirme']
    ];

    for (let i = 0; i < posts.length; i++) {
      const post = new Post({
        ...posts[i],
        author: adminUser._id,
        category: postCategoryMap[i]?._id || createdCategories[0]._id
      });
      await post.save();
      console.log(`   ✓ "${posts[i].title}" yazısı oluşturuldu`);
    }

    // Create tags
    console.log('🏷️  Etiketler oluşturuluyor...');
    const allTags = [...new Set(posts.flatMap(p => p.tags))];
    for (const tagName of allTags) {
      const tag = new Tag({ name: tagName.toLowerCase() });
      await tag.save();
      console.log(`   ✓ ${tagName} etiketi oluşturuldu`);
    }

    console.log('');
    console.log('✅ Veritabanı başarıyla dolduruldu!');
    console.log('');
    console.log('📊 Özet:');
    console.log(`   - ${createdCategories.length} kategori`);
    console.log(`   - ${posts.length} blog yazısı`);
    console.log(`   - ${allTags.length} etiket`);
    console.log(`   - 2 kullanıcı (1 admin, 1 normal)`);
    console.log('');
    console.log('🔑 Giriş Bilgileri:');
    console.log('   Admin: admin@penlink.com / admin123');
    console.log('   User:  user@example.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

seedDatabase();

