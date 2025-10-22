import React from 'react';
import { Users, Target, Lightbulb, Heart } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Odaklanmış Yaklaşım',
      description: 'Her projede müşteri ihtiyaçlarına odaklanarak en iyi çözümleri sunuyoruz.'
    },
    {
      icon: Lightbulb,
      title: 'Yaratıcı Çözümler',
      description: 'Geleneksel yöntemlerin ötesinde, yaratıcı ve yenilikçi yaklaşımlar geliştiriyoruz.'
    },
    {
      icon: Heart,
      title: 'Müşteri Memnuniyeti',
      description: 'Müşteri memnuniyeti bizim için en önemli önceliktir ve bunu her projede kanıtlıyoruz.'
    }
  ];

  const team = [
    {
      name: 'Ahmet Yılmaz',
      role: 'Proje Yöneticisi',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Elif Kaya',
      role: 'Frontend Geliştirici',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Mehmet Demir',
      role: 'Backend Geliştirici',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Zeynep Özkan',
      role: 'UI/UX Tasarımcı',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Hakkımızda
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Teknoloji tutkusu ile bir araya gelen deneyimli ekibimiz, 
              modern web uygulamaları geliştiriyor.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Hikayemiz
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                2020 yılında kurulan 429Project, teknoloji alanında yenilikçi çözümler 
                sunma vizyonu ile yola çıktı. Küçük bir ekip olarak başladığımız yolculuğumuzda, 
                bugün 50'den fazla başarılı projeyi hayata geçirdik.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Müşteri odaklı yaklaşımımız ve kaliteli hizmet anlayışımız sayesinde, 
                sektörde güvenilir bir marka haline geldik. Her projede müşteri 
                memnuniyetini ön planda tutarak, en iyi sonuçları elde etmeye odaklanıyoruz.
              </p>
              <div className="flex items-center">
                <Users className="w-8 h-8 text-primary-600 mr-3" />
                <span className="text-lg font-semibold text-gray-900">
                  10+ Uzman Ekip Üyesi
                </span>
              </div>
            </div>
            <div className="bg-gray-100 rounded-xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
                  <div className="text-gray-600">Tamamlanan Proje</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">100+</div>
                  <div className="text-gray-600">Mutlu Müşteri</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">5+</div>
                  <div className="text-gray-600">Yıllık Deneyim</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
                  <div className="text-gray-600">Destek</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Değerlerimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Çalışma prensiplerimizi oluşturan temel değerlerimiz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-lg mb-6">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ekibimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Projelerinizi hayata geçiren deneyimli ve yetenekli ekibimiz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
