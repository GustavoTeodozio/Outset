import { useState } from 'react';
import { PricingModal } from '../../components/client/PricingModal';

export function OutsetIA() {
  const [activeFeature, setActiveFeature] = useState<'responses' | 'comments' | 'goals' | null>(null);
  const [showPricing, setShowPricing] = useState(false);

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 font-outer-sans">Outset IA</h1>
            <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold mt-1">
              BETA
            </span>
          </div>
        </div>
        <p className="text-xl text-gray-600 font-outer-sans">
          Conheça o seu novo parceiro nas redes sociais
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Feature 1: Respostas da IA */}
        <div
          className={`card-gradient p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
            activeFeature === 'responses' ? 'ring-4 ring-purple-500 ring-opacity-50' : ''
          }`}
          onClick={() => setActiveFeature(activeFeature === 'responses' ? null : 'responses')}
        >
          <div className="bg-white rounded-xl p-4 mb-4 shadow-lg border-2 border-gray-200">
            {/* Mockup de Chat */}
            <div className="space-y-3">
              <div className="flex justify-end">
                <div className="bg-gray-100 rounded-2xl rounded-tr-none px-4 py-2 max-w-[80%]">
                  <p className="text-sm text-gray-800 font-outer-sans">Quanto tempo dura o curso?</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%]">
                  <p className="text-sm text-white font-outer-sans">
                    8 semanas! Aulas em vídeo + materiais + acesso vitalício. Você está pronto??
                  </p>
                </div>
              </div>
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2 font-outer-sans">Respostas da IA</h3>
          <p className="text-sm text-gray-600 font-outer-sans">
            Você compartilha seu conhecimento, a IA responde por você a qualquer hora
          </p>
        </div>

        {/* Feature 2: Comentários da IA */}
        <div
          className={`card-gradient p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
            activeFeature === 'comments' ? 'ring-4 ring-purple-500 ring-opacity-50' : ''
          }`}
          onClick={() => setActiveFeature(activeFeature === 'comments' ? null : 'comments')}
        >
          <div className="bg-white rounded-xl p-4 mb-4 shadow-lg border-2 border-gray-200">
            {/* Mockup de Post com Comentário */}
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 font-outer-sans mb-2">Post</p>
                <p className="text-sm text-gray-800 font-outer-sans">Seu feedback realmente nos inspira a continuar criando!</p>
              </div>
              <div className="border-t pt-3 space-y-2">
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <p className="text-xs text-gray-600 font-outer-sans">Comentário do usuário</p>
                </div>
                <div className="bg-purple-50 rounded-lg px-3 py-2 border-l-4 border-purple-500">
                  <p className="text-xs text-purple-800 font-outer-sans">Isso significa muito. Falou com você</p>
                </div>
              </div>
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2 font-outer-sans">Comentários da IA</h3>
          <p className="text-sm text-gray-600 font-outer-sans">
            Você escolhe o tom, e a IA responde a elogios do jeito que você responderia
          </p>
        </div>

        {/* Feature 3: Metas da IA */}
        <div
          className={`card-gradient p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
            activeFeature === 'goals' ? 'ring-4 ring-purple-500 ring-opacity-50' : ''
          }`}
          onClick={() => setActiveFeature(activeFeature === 'goals' ? null : 'goals')}
        >
          <div className="bg-white rounded-xl p-4 mb-4 shadow-lg border-2 border-gray-200">
            {/* Mockup de DM */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
                <p className="text-sm font-semibold text-gray-800 font-outer-sans">Jessica Peel</p>
              </div>
              <div className="space-y-2">
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <p className="text-xs text-gray-800 font-outer-sans">
                    Ei! Que bom saber que você adorou! Gostaria de participar da sessão?
                  </p>
                </div>
                <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg px-4 py-2 text-sm font-semibold font-outer-sans shadow-md hover:shadow-lg transition-shadow">
                  Registrar agora
                </button>
              </div>
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2 font-outer-sans">Metas da IA</h3>
          <p className="text-sm text-gray-600 font-outer-sans">
            A IA guiará suas respostas para que você alcance seu objetivo, seja gerar leads, ganhar seguidores, cliques ou qualquer outra métrica relevante
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="text-center">
        <button
          onClick={() => setShowPricing(true)}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-outer-sans"
        >
          Obtenha A IA Da Outset
        </button>
      </div>

      {/* Pricing Modal */}
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />

      {/* Expanded Feature Details */}
      {activeFeature && (
        <div className="mt-8 card-gradient p-8 rounded-2xl animate-fade-in">
          {activeFeature === 'responses' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 font-outer-sans">Respostas da IA</h2>
              <p className="text-gray-600 mb-6 font-outer-sans">
                Configure sua IA para responder automaticamente a perguntas frequentes. Compartilhe seu conhecimento e deixe a IA trabalhar 24/7.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-2 font-outer-sans">Base de Conhecimento</h3>
                  <p className="text-sm text-gray-600 font-outer-sans">
                    Adicione informações sobre seus produtos, serviços e processos
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-2 font-outer-sans">Respostas Automáticas</h3>
                  <p className="text-sm text-gray-600 font-outer-sans">
                    A IA responde instantaneamente, mesmo quando você não está online
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeFeature === 'comments' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 font-outer-sans">Comentários da IA</h2>
              <p className="text-gray-600 mb-6 font-outer-sans">
                Defina o tom e estilo das respostas. A IA aprenderá como você se comunica e responderá de forma autêntica.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-2 font-outer-sans">Personalização de Tom</h3>
                  <p className="text-sm text-gray-600 font-outer-sans">
                    Escolha entre formal, casual, amigável ou profissional
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-2 font-outer-sans">Respostas Contextuais</h3>
                  <p className="text-sm text-gray-600 font-outer-sans">
                    A IA entende o contexto e responde de forma apropriada
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeFeature === 'goals' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 font-outer-sans">Metas da IA</h2>
              <p className="text-gray-600 mb-6 font-outer-sans">
                Configure objetivos específicos e deixe a IA guiar as conversas para alcançá-los.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-2 font-outer-sans">Geração de Leads</h3>
                  <p className="text-sm text-gray-600 font-outer-sans">
                    A IA direciona conversas para capturar informações de contato
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-2 font-outer-sans">Aumento de Seguidores</h3>
                  <p className="text-sm text-gray-600 font-outer-sans">
                    Engajamento estratégico para crescer sua audiência
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-2 font-outer-sans">Conversões</h3>
                  <p className="text-sm text-gray-600 font-outer-sans">
                    Guia usuários para ações específicas como cliques e vendas
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setActiveFeature(null)}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-outer-sans"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

