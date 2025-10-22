import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, 
  Smartphone, 
  Database, 
  Shield, 
  Zap, 
  Palette,
  Code,
  Cloud,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Globe,
      title: 'Web Uygulaması Geliştirme',
      description: 'Modern ve ölçeklenebilir web uygulamaları geliştiriyoruz.',
      features: ['Responsive Tasarım', 'SEO Optimizasyonu', 'Hızlı Yükleme', 'Güvenlik'],
      price: 'Başlangıç: ₺15.000'
    },
    {
      icon: Smartphone,
      title: 'Mobil Uygulama',
      description: 'iOS ve Android platformları için native ve cross-platform uygulamalar.',
      features: ['Native Geliştirme', 'Cross-Platform', 'UI/UX Tasarım', 'App Store Optimizasyonu'],
      price: 'Başlangıç: ₺25.000'
    },
    {
      icon: Database,
      title: 'Backend Geliştirme',
      description: 'Güvenli ve ölçeklenebilir backend sistemleri ve API geliştirme.',
      features: ['API Geliştirme', 'Veritabanı Tasarımı', 'Güvenlik', 'Performans Optimizasyonu'],
      price: 'Başlangıç: ₺12.000'
    },
    {
      icon: Palette,
      title: 'UI/UX Tasarım',
      description: 'Kullanıcı odaklı ve modern arayüz tasarımları.',
      features: ['Wireframe', 'Prototip', 'Kullanıcı Testi', 'Tasarım Sistemi'],
      price: 'Başlangıç: ₺8.000'
    },
    {
      icon: Cloud,
      title: 'Cloud Çözümleri',
      description: 'Bulut altyapısı kurulumu ve yönetimi hizmetleri.',
      features: ['AWS/Azure', 'DevOps', 'Otomatik Yedekleme', 'Monitoring'],
      price: 'Başlangıç: ₺10.000'
    },
    {
      icon: Shield,
      title: 'Güvenlik Danışmanlığı',
      description: 'Uygulamalarınızın güvenliğini artırmak için kapsamlı güvenlik analizi.',
      features: ['Güvenlik Testi', 'Penetrasyon Testi', 'Güvenlik Politikaları', 'Eğitim'],
      price: 'Başlangıç: ₺5.000'
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Keşif ve Planlama',
      description: 'Proje gereksinimlerini analiz eder ve detaylı bir plan oluştururuz.'
    },
    {
      step: '02',
      title: 'Tasarım ve Prototip',
      description: 'Kullanıcı deneyimini ön planda tutarak tasarım ve prototip geliştiririz.'
    },
    {
      step: '03',
      title: 'Geliştirme',
      description: 'Modern teknolojiler kullanarak projeyi adım adım hayata geçiririz.'
    },
    {
      step: '04',
      title: 'Test ve Yayın',
      description: 'Kapsamlı testler yaparak projeyi güvenle yayına alırız.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Hizmetlerimiz
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Modern teknolojiler ile projelerinizi hayata geçiriyoruz. 
              Her ihtiyaca uygun çözümler sunuyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sunduğumuz Hizmetler
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Teknoloji ihtiyaçlarınız için kapsamlı çözümler sunuyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-lg mb-6">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="text-primary-600 font-semibold mb-4">
                    {service.price}
                  </div>
                  <Link
                    to="/contact"
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
                  >
                    Teklif Al
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Çalışma Sürecimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Projelerinizi adım adım nasıl hayata geçirdiğimizi keşfedin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Projenizi Hayata Geçirmeye Hazır mısınız?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Uzman ekibimizle birlikte hayalinizdeki projeyi gerçeğe dönüştürün.
          </p>
          <Link
            to="/contact"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Ücretsiz Danışmanlık Al
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
