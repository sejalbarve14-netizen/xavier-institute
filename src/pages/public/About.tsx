import { Target, Eye, Heart, Users, Award, BookOpen, TrendingUp, Globe } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

const values = [
  { icon: <Target className="h-6 w-6" />, title: 'Excellence', desc: 'We pursue the highest standards in teaching, research, and service.' },
  { icon: <Heart className="h-6 w-6" />, title: 'Integrity', desc: 'We uphold honesty, ethics, and transparency in all our endeavours.' },
  { icon: <Users className="h-6 w-6" />, title: 'Inclusivity', desc: 'We foster a diverse and welcoming community where every voice matters.' },
  { icon: <TrendingUp className="h-6 w-6" />, title: 'Innovation', desc: 'We embrace creativity and continuous improvement in everything we do.' },
];

const milestones = [
  { year: '1988', title: 'Foundation', desc: 'Established with 2 departments and 120 students.' },
  { year: '1995', title: 'Expansion', desc: 'Added Electronics & Communication department; NAAC accreditation.' },
  { year: '2005', title: 'Growth', desc: 'Launched Business Administration and postgraduate programs.' },
  { year: '2015', title: 'Innovation Hub', desc: 'Opened the student startup incubation and innovation center.' },
  { year: '2024', title: 'Excellence', desc: 'NAAC A+ grade; ranked among top 50 engineering institutes nationwide.' },
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex items-center justify-center bg-slate-900 py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-slate-900 to-slate-800" />
        <div className="relative text-center">
          <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-300">About Us</div>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Our Story & Mission</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Three decades of nurturing talent, driving innovation, and building leaders.
          </p>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="card p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                To provide quality technical and management education that empowers students with
                knowledge, skills, and values needed to address contemporary challenges. We are
                committed to fostering research, innovation, and entrepreneurship that contribute
                to the social and economic development of the nation.
              </p>
            </div>
            <div className="card p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
                <Eye className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                To be a globally recognized institution of academic excellence, producing
                socially responsible professionals and innovators who lead with integrity and
                compassion. We aspire to be a hub of cutting-edge research that transforms
                industries and improves lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="What We Stand For" title="Our Core Values" subtitle="The principles that guide our institution, our people, and our decisions." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="card p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{v.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey / Timeline */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Our Journey" title="Milestones Through the Years" />
          <div className="space-y-0">
            {milestones.map((m, i) => (
              <div key={m.year} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white shadow-md">
                    {m.year}
                  </div>
                  {i < milestones.length - 1 && <div className="w-px flex-1 bg-slate-200 my-2" />}
                </div>
                <div className="pb-10">
                  <h3 className="text-lg font-bold text-slate-900">{m.title}</h3>
                  <p className="mt-1 text-slate-600">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership stats */}
      <section className="bg-brand-600 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8">
          {[
            { icon: <BookOpen className="h-7 w-7" />, value: '35+', label: 'Years of Service' },
            { icon: <Users className="h-7 w-7" />, value: '12,000+', label: 'Alumni Worldwide' },
            { icon: <Award className="h-7 w-7" />, value: '95%', label: 'Placement Rate' },
            { icon: <Globe className="h-7 w-7" />, value: '20+', label: 'Industry Partners' },
          ].map((s) => (
            <div key={s.label} className="text-center text-white">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">{s.icon}</div>
              <div className="text-3xl font-bold">{s.value}</div>
              <div className="mt-1 text-sm text-brand-100">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
