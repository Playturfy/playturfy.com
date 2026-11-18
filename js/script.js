/**
 * Turfy - Main JavaScript
 * Lightweight, zero dependencies, accessible interactions
 */

(function () {
  'use strict';

  // 1. Sticky Header & Mobile Sticky Bar scroll effect
  const header = document.getElementById('header');
  const stickyBar = document.querySelector('.mobile-sticky-bar');
  const handleScroll = () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }
    if (stickyBar) {
      stickyBar.classList.toggle('visible', window.scrollY > 360);
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Menu Drawer
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Smooth scrolling for hash links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // 4. Role Tabs (Player / Captain / Organizer)
  const roleTabButtons = document.querySelectorAll('.role-tab-btn');
  const rolePanels = document.querySelectorAll('.role-panel');
  if (roleTabButtons.length && rolePanels.length) {
    roleTabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetRole = btn.getAttribute('data-role');
        roleTabButtons.forEach((b) => {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });

        rolePanels.forEach((panel) => {
          if (panel.id === `role-${targetRole}`) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });
  }

  // 5. FAQ Accordion (accessible with aria-expanded)
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all items
      faqItems.forEach((other) => {
        other.classList.remove('open');
        const otherBtn = other.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });
      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // 6. iPhone Waitlist Modal
  const waitlistTriggers = document.querySelectorAll('[data-open-waitlist]');
  const waitlistModal = document.getElementById('waitlist-modal');
  const waitlistClose = document.getElementById('waitlist-close');

  const openWaitlist = () => {
    if (waitlistModal) {
      waitlistModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      const input = waitlistModal.querySelector('input[type="email"]');
      if (input) input.focus();
    }
  };

  const closeWaitlist = () => {
    if (waitlistModal) {
      waitlistModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  waitlistTriggers.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openWaitlist();
    });
  });

  if (waitlistClose) {
    waitlistClose.addEventListener('click', closeWaitlist);
  }

  if (waitlistModal) {
    waitlistModal.addEventListener('click', (e) => {
      if (e.target === waitlistModal) closeWaitlist();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && waitlistModal && waitlistModal.classList.contains('open')) {
      closeWaitlist();
    }
  });

  // 7. Auto-detect iOS to offer waitlist CTA
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIOS) {
    const stickyDownload = document.getElementById('sticky-download-btn');
    if (stickyDownload) {
      stickyDownload.textContent = 'iPhone Waitlist';
      stickyDownload.href = '#';
      stickyDownload.addEventListener('click', (e) => {
        e.preventDefault();
        openWaitlist();
      });
    }
  }

  // 8. Contact & Waitlist Forms - Asynchronous submission (Prevents redirect & Cloudflare 521 crashes)
  function handleFormSubmission(form, successMsg) {
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalHtml = submitBtn ? submitBtn.innerHTML : 'Submit';

      let statusEl = form.querySelector('.form-status');
      if (!statusEl) {
        statusEl = document.createElement('div');
        statusEl.className = 'form-status';
        form.appendChild(statusEl);
      }
      statusEl.style.display = 'none';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      const formData = new FormData(form);

      try {
        const response = await fetch('https://formsubmit.co/ajax/turfy.sports@gmail.com', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        if (response.ok) {
          form.reset();
          statusEl.className = 'form-status form-success';
          statusEl.textContent = successMsg || '✓ Message sent successfully! We will get back to you soon.';
          statusEl.style.display = 'block';
        } else {
          throw new Error('Server returned ' + response.status);
        }
      } catch (err) {
        const nameVal = formData.get('name') || '';
        const msgVal = formData.get('message') || formData.get('email') || '';
        const mailtoUrl = `mailto:turfy.sports@gmail.com?subject=Inquiry from ${encodeURIComponent(nameVal || 'Playturfy Website')}&body=${encodeURIComponent(msgVal)}`;
        
        statusEl.className = 'form-status form-error';
        statusEl.innerHTML = `Message service is temporarily busy. <a href="${mailtoUrl}" style="color: var(--lime); text-decoration: underline; font-weight: 600;">Click here to send directly via Email</a>`;
        statusEl.style.display = 'block';
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHtml;
        }
      }
    });
  }

  handleFormSubmission(
    document.querySelector('.contact-form'),
    '✓ Thank you! Your message has been sent to the Turfy team.'
  );

  const waitlistForm = document.querySelector('#waitlist-modal form');
  handleFormSubmission(
    waitlistForm,
    '✓ You’re on the waitlist! We’ll notify you when the iOS app launches.'
  );

  // 9. Automatic Region & Browser Language Localization (Full Page Coverage)
  const translations = {
    pt: {
      nav_features: 'Recursos',
      nav_roles: 'Para quem é',
      nav_how: 'Como funciona',
      nav_faq: 'Dúvidas',
      nav_news: 'Notícias',
      nav_contact: 'Contato',
      btn_download_free: 'Baixar Grátis',
      btn_get_google_play: 'Baixar Turfy no Google Play',
      hero_tag: 'O App Completo para o Seu Futebol',
      hero_title: 'Marque jogos ao vivo.<br>Crie campeonatos.<br><span class="lime">Registre cada estatística.</span>',
      hero_desc: 'Feito para <strong>jogadores, capitães e organizadores</strong>. Marque peladas, jogos de Society, Futsal ou Campo ao vivo, acompanhe seus gols e estatísticas na carreira, escale seu time e crie campeonatos — 100% grátis e offline.',
      pill_1: 'Placar ao Vivo em 1 Toque',
      pill_2: 'Estatísticas e Escalação',
      pill_3: 'Campeonatos Automáticos',
      pill_4: 'Funciona 100% Offline',
      btn_play_sub: 'Disponível no',
      ios_waitlist_cta: 'iPhone em breve · <strong>Receber aviso</strong>',
      rating_text: '<strong>5.0</strong> no Google Play · 100% Grátis · Sem Anúncios',
      check_free: '100% Grátis',
      check_noads: 'Sem anúncios',
      check_offline: 'Funciona offline',
      trust_1_title: 'Placar ao Vivo em 1 Toque',
      trust_1_sub: 'Gols, cartões e substituições',
      trust_2_title: 'Campeonatos Automáticos',
      trust_2_sub: 'Pontos corridos, grupos e mata-mata',
      trust_3_title: 'Estatísticas e Relatórios PDF',
      trust_3_sub: 'Cards de jogadores e súmulas',
      trust_4_title: 'Modo 100% Offline',
      trust_4_sub: 'Funciona em campos sem sinal',
      features_tag: 'Recursos Principais',
      features_title: 'Tudo o que você precisa no dia do jogo.',
      features_desc: 'Feito para substituir grupos bagunçados, cadernos perdidos e tabelas manuais com um simples toque.',
      f1_tag: 'Recurso #1',
      f1_title: 'Placar da Partida ao Vivo',
      f1_desc: 'Toque uma vez para registrar gol, cartão, assistência ou substituição. Cronômetro, acréscimos e intervalo já vêm integrados com opção de desfazer.',
      f1_b1: '<strong>Botões rápidos:</strong> Gol, Substituição, Cartão, Pausa e Desfazer.',
      f1_b2: '<strong>Marcação de jogadores:</strong> Marque quem fez o gol e quem deu a assistência.',
      f1_b3: '<strong>Fases do jogo:</strong> Controle automático de 1º Tempo, 2º Tempo e Prorrogação.',
      f1_btn: 'Testar Placar ao Vivo Grátis →',
      f2_tag: 'Recurso #2',
      f2_title: 'Campeonatos Automatizados',
      f2_desc: 'Monte seu torneio em minutos. Os confrontos são gerados automaticamente e as tabelas calculam pontos, saldo de gols e classificação na hora.',
      f2_b1: '<strong>Vários formatos:</strong> Pontos Corridos, Mata-Mata, Fase de Grupos + Finais.',
      f2_b2: '<strong>Classificação ao vivo:</strong> Pontos, vitórias, saldo de gols e gols pró automáticos.',
      f2_b3: '<strong>Chaveamento:</strong> As chaves do mata-mata avançam sozinhas a cada vitória.',
      f2_btn: 'Criar um Campeonato →',
      f3_tag: 'Recurso #3',
      f3_title: 'Estatísticas e Súmulas em PDF',
      f3_desc: 'Cada gol, assistência, cartão e presença fica salvo no perfil do jogador. Exporte súmulas profissionais em PDF com um toque.',
      f3_b1: '<strong>Estatísticas da carreira:</strong> Gols, assistências, jogos sem sofrer gols e cartões.',
      f3_b2: '<strong>PDF em 1 toque:</strong> Compartilhe súmulas prontas para impressão com técnicos e patrocinadores.',
      f3_b3: '<strong>Ranking de artilharia:</strong> Acompanhamento automático do artilheiro do campeonato.',
      f3_btn: 'Acompanhar Estatísticas →',
      roles_tag: 'Experiência Personalizada',
      roles_title: 'Feito para todos dentro e fora de campo.',
      roles_desc: 'Escolha seu perfil para ver como o Turfy facilita seu dia de jogo.',
      role_tab_player: 'Jogadores',
      role_tab_captain: 'Capitães',
      role_tab_organizer: 'Organizadores',
      rp_title: 'Acompanhe sua trajetória no futebol',
      rp_desc: 'Chega de discutir quem fez mais gols ou assistências. Suas estatísticas são salvas em tempo real no seu perfil, prontas para compartilhar.',
      rp_b1: 'Contagem pessoal de gols, assistências e cartões',
      rp_b2: 'Entre em vários times usando código de convite',
      rp_b3: 'Cards de resumo da partida prontos para WhatsApp e Instagram',
      rp_btn: 'Baixar Turfy para Jogadores',
      rc_title: 'Gerencie seu elenco sem planilhas',
      rc_desc: 'Defina a escalação titular, registre substituições durante o jogo e mantenha o histórico oficial de cada partida da temporada.',
      rc_b1: 'Elenco completo com fotos e numeração das camisas',
      rc_b2: 'Escalação pré-jogo e registro de substituições em tempo real',
      rc_b3: 'Cards instantâneos de resultado para o grupo do time',
      rc_btn: 'Baixar Turfy para Capitães',
      ro_title: 'Organize campeonatos locais profissionais',
      ro_desc: 'Elimine cálculos manuais. Gere tabelas, atualize grupos automaticamente e transmita jogos ao vivo com placar no OBS Studio.',
      ro_b1: 'Tabelas de grupos e chaves de mata-mata automáticas',
      ro_b2: 'Integração de placar ao vivo com OBS Studio e Streamlabs',
      ro_b3: 'Relatórios oficiais do torneio em PDF para patrocinadores e equipes',
      ro_btn: 'Baixar Turfy para Organizadores',
      extras_tag: 'Recursos Extras',
      extras_title: 'Muito mais dentro do Turfy.',
      extras_desc: 'Ferramentas criadas especialmente para o futebol amador, society e de base.',
      ex1_title: 'Placar ao Vivo para OBS Studio',
      ex1_desc: 'Vai transmitir a final? Toque no ícone de transmissão no celular, cole o link no OBS ou Streamlabs como Navegador e tenha um placar de TV ao vivo.',
      ex2_title: 'Notícias de Futebol no App',
      ex2_desc: 'Fique atualizado entre as rodadas. O Turfy traz as últimas notícias, resultados e análises diretamente no feed do aplicativo.',
      ex3_title: 'Cards para Redes Sociais',
      ex3_desc: 'Jogo emocionante? O Turfy formata o placar final, autores dos gols e escudos em um card pronto para WhatsApp, Instagram e Facebook.',
      steps_tag: 'Configuração Rápida',
      steps_title: 'Pronto em 3 passos simples.',
      steps_desc: 'Sem cadastro complicado. Você começa a marcar sua primeira partida em menos de 60 segundos.',
      step_1_title: 'Crie sua Partida',
      step_1_desc: 'Escolha dois times, defina o tempo de jogo e escale os titulares ou comece imediatamente.',
      step_2_title: 'Marque ao Vivo',
      step_2_desc: 'Toque para registrar gols, cartões e substituições na beira do campo.',
      step_3_title: 'Compartilhe e Exporte',
      step_3_desc: 'Gere um card de resumo para o WhatsApp ou exporte a súmula completa em PDF.',
      faq_tag: 'Dúvidas?',
      faq_title: 'Perguntas Frequentes',
      faq_desc: 'Respostas diretas para o que jogadores e organizadores mais perguntam.',
      faq_q1: 'O Turfy é realmente 100% gratuito?',
      faq_a1: 'Sim, totalmente grátis. Não há assinaturas, compras no app nem anúncios. Todos os recursos — placar ao vivo, chaves de campeonatos, estatísticas, relatórios PDF e overlay OBS — são gratuitos para sempre.',
      faq_q2: 'O Turfy funciona offline sem internet?',
      faq_a2: 'Sim. Você pode marcar jogos e gerenciar campeonatos em campos sem sinal de celular. Tudo fica salvo no aparelho e sincroniza na nuvem assim que reconectar.',
      faq_q3: 'Quais formatos de campeonato são suportados?',
      faq_a3: 'O Turfy suporta Pontos Corridos, Mata-Mata (eliminatória simples) e Fase de Grupos + Mata-Mata (3 a 32 times). Os jogos são gerados automaticamente e a tabela atualiza ao fim de cada partida.',
      faq_q4: 'Existe versão para iPhone / iOS?',
      faq_a4: 'O Turfy está disponível para Android (5.0+). A versão para iPhone / iOS está em desenvolvimento — entre na lista de espera nesta página para ser avisado no lançamento.',
      faq_q5: 'Como funciona o placar de transmissão no OBS Studio?',
      faq_a5: 'Gere o link de transmissão direto no app e cole no OBS Studio, Streamlabs ou vMix como Fonte de Navegador (Browser Source). O placar atualiza ao vivo na transmissão a cada gol ou cartão marcado no celular.',
      faq_q6: 'Posso exportar súmulas e estatísticas em PDF?',
      faq_a6: 'Sim. O Turfy gera súmulas de partidas e relatórios de estatísticas em PDF com um toque, prontos para enviar no WhatsApp ou imprimir.',
      faq_q7: 'Posso usar para Futebol Society (7x7), Futsal (5x5) e Campo?',
      faq_a7: 'Sim. Suporta 5x5, 6x6, 7x7 Society, 8x8, 9x9, Futsal e 11x11 com duração de tempos, tamanho de elenco e substituições configuráveis.',
      faq_q8: 'Como jogadores e torcedores acompanham placares e tabelas?',
      faq_a8: 'Conforme os gols e cartões são registrados, placares, tabelas de grupos, chaves do mata-mata e artilharia atualizam automaticamente, além dos cards visuais para WhatsApp e Instagram.',
      faq_q9: 'Como funciona um campeonato de 28 times (ou 3 a 32 times) com Grupos + Mata-Mata?',
      faq_a9: 'O Turfy calcula grupos e mata-mata automaticamente de 3 a 32 times. Com 28 times, cria 7 grupos de 4 (42 jogos). Os 2 melhores de cada grupo (14 times) mais os 2 melhores terceiros colocados (por Pontos, Saldo de Gols e Gols Pró) avançam para as Oitavas de Final de 16 times (57 jogos no total).',
      faq_q10: 'Qual é o melhor aplicativo grátis para organizar campeonatos de futebol?',
      faq_a10: 'O Turfy reúne placar ao vivo, tabelas automáticas de 3 a 32 times, estatísticas de jogadores, súmulas em PDF e placar para OBS Studio sem anúncios e sem mensalidades.',
      faq_q11: 'Qual a diferença do Turfy para planilhas ou apps pagos?',
      faq_a11: 'Diferente de planilhas manuais ou apps que cobram para liberar o mata-mata ou PDF, o Turfy é 100% gratuito para até 32 times, funciona offline e calcula critérios de desempate estilo FIFA automaticamente.',
      cta_title: 'Seu próximo dia de jogo <span class="lime">começa aqui.</span>',
      cta_desc: 'Junte-se a jogadores, capitães e organizadores de campeonatos no mundo todo que usam o Turfy. Grátis para sempre. Sem anúncios. Funciona offline.',
      cta_btn_play: 'Baixar Turfy Grátis no Google Play',
      cta_btn_ios: 'Lista de Espera iPhone',
      qr_label: 'Escaneie com o celular para instalar',
      contact_tag: 'Suporte e Feedback',
      contact_title: 'Fale com a nossa equipe.',
      contact_desc: 'Tem alguma dúvida, sugestão de recurso para seu campeonato ou feedback? Lemos todas as mensagens.',
      contact_lbl_name: 'Seu Nome',
      contact_lbl_email: 'Seu E-mail',
      contact_lbl_msg: 'Mensagem',
      contact_btn: 'Enviar Mensagem',
      contact_direct: 'Ou envie um e-mail diretamente para',
      footer_tagline: 'O aplicativo gratuito de placar ao vivo e campeonatos para o futebol amador e de base.',
      footer_col_app: 'App e Soluções',
      footer_link_tm: 'Criador de Tabelas e Torneios',
      footer_link_obs: 'Placar ao Vivo para OBS',
      footer_link_turf: 'Placar Society 7x7 e Futsal 5x5',
      footer_col_legal: 'Conteúdo e Legal',
      footer_link_privacy: 'Política de Privacidade',
      footer_link_terms: 'Termos e Condições',
      footer_col_connect: 'Conecte-se',
      footer_social_desc: 'Siga o Turfy nas redes sociais para novidades e destaques.',
      footer_motto: 'Marque jogos. Crie campeonatos. Acompanhe suas estatísticas.',
      sticky_sub: 'Grátis · Sem anúncios · Offline',
      waitlist_tag: 'Em Breve',
      waitlist_title: 'Turfy para iPhone',
      waitlist_desc: 'Digite seu e-mail e avisaremos assim que a versão iOS for lançada na App Store. Sem spam.',
      waitlist_btn: 'Avise-me no Lançamento'
    },
    es: {
      nav_features: 'Funciones',
      nav_roles: 'Para quién es',
      nav_how: 'Cómo funciona',
      nav_faq: 'Preguntas',
      nav_news: 'Noticias',
      nav_contact: 'Contacto',
      btn_download_free: 'Descargar Gratis',
      btn_get_google_play: 'Descargar Turfy en Google Play',
      hero_tag: 'La App Todo en Uno para tu Fútbol',
      hero_title: 'Anota partidos en vivo.<br>Organiza torneos.<br><span class="lime">Registra cada estadística.</span>',
      hero_desc: 'Creado para <strong>jugadores, capitanes y organizadores</strong>. Anota partidos amistosos de Fútbol 5, 7 o 11 en vivo, lleva tus goles y estadísticas personales, arma alineaciones y organiza torneos — 100% gratis y sin internet.',
      pill_1: 'Marcador en Vivo al Instante',
      pill_2: 'Estadísticas y Alineación',
      pill_3: 'Torneos Automáticos',
      pill_4: 'Funciona 100% Offline',
      btn_play_sub: 'Disponible en',
      ios_waitlist_cta: 'iPhone muy pronto · <strong>Avísame</strong>',
      rating_text: '<strong>5.0</strong> en Google Play · 100% Gratis · Sin Anuncios',
      check_free: 'Gratis siempre',
      check_noads: 'Sin anuncios',
      check_offline: 'Funciona offline',
      trust_1_title: 'Marcador en Vivo al Instante',
      trust_1_sub: 'Goles, tarjetas y cambios en tiempo real',
      trust_2_title: 'Torneos Automatizados',
      trust_2_sub: 'Liga, fase de grupos y eliminatorias',
      trust_3_title: 'Estadísticas y Reportes PDF',
      trust_3_sub: 'Tarjetas de partido y goleadores',
      trust_4_title: 'Modo 100% Sin Internet',
      trust_4_sub: 'Funciona en canchas sin señal',
      features_tag: 'Funciones Principales',
      features_title: 'Todo lo que necesitas el día del partido.',
      features_desc: 'Diseñado para reemplazar chats caóticos, libretas perdidas y tablas manuales con un solo toque.',
      f1_tag: 'Función #1',
      f1_title: 'Marcador de Partidos en Vivo',
      f1_desc: 'Toca una vez para registrar un gol, tarjeta, asistencia o cambio. Cronómetro, tiempo extra y descanso integrados con opción de deshacer.',
      f1_b1: '<strong>Botones instantáneos:</strong> Gol, Cambio, Tarjeta, Pausa y Deshacer rápido.',
      f1_b2: '<strong>Etiquetado de jugadores:</strong> Registra quién anotó y quién asistió con un toque.',
      f1_b3: '<strong>Fases del partido:</strong> Control automático de 1er Tiempo, 2do Tiempo y Tiempo Extra.',
      f1_btn: 'Probar Marcador en Vivo Gratis →',
      f2_tag: 'Función #2',
      f2_title: 'Torneos Automatizados',
      f2_desc: 'Configura tu torneo en minutos. El calendario se genera solo y las tablas calculan puntos, diferencia de goles y clasificación al instante.',
      f2_b1: '<strong>Múltiples formatos:</strong> Todos contra todos, Eliminatoria, Grupos + Finales.',
      f2_b2: '<strong>Tablas en vivo:</strong> Puntos, victorias, derrotas y diferencia de goles automáticos.',
      f2_b3: '<strong>Llaves eliminatorias:</strong> El cuadro de octavos, cuartos y semifinales avanza solo.',
      f2_btn: 'Crear un Torneo →',
      f3_tag: 'Función #3',
      f3_title: 'Estadísticas de Jugadores y Reportes PDF',
      f3_desc: 'Cada gol, asistencia, tarjeta y partido jugado se guarda en el perfil del jugador. Exporta actas profesionales en PDF con un toque.',
      f3_b1: '<strong>Estadísticas de carrera:</strong> Goles, asistencias, vallas invictas e historial de tarjetas.',
      f3_b2: '<strong>PDF en 1 toque:</strong> Comparte actas imprimibles con entrenadores o patrocinadores.',
      f3_b3: '<strong>Tabla de goleadores:</strong> Seguimiento automático del Bota de Oro de tu torneo.',
      f3_btn: 'Seguir tus Estadísticas →',
      roles_tag: 'Experiencia Personalizada',
      roles_title: 'Creado para todos en la cancha.',
      roles_desc: 'Elige tu rol para ver cómo Turfy facilita tu día de partido.',
      role_tab_player: 'Jugadores',
      role_tab_captain: 'Capitanes',
      role_tab_organizer: 'Organizadores',
      rp_title: 'Sigue tu carrera futbolística personal',
      rp_desc: 'Deja de discutir quién llevó más goles o asistencias. Tus estadísticas se guardan en tiempo real en tu perfil, listas para compartir.',
      rp_b1: 'Conteo personal de goles, asistencias y tarjetas',
      rp_b2: 'Únete a varios equipos con un código de invitación',
      rp_b3: 'Tarjetas de resumen del partido listas para WhatsApp e Instagram',
      rp_btn: 'Obtener Turfy para Jugadores',
      rc_title: 'Gestiona tu plantilla sin hojas de cálculo',
      rc_desc: 'Arma alineaciones titulares, registra cambios durante el juego y lleva el historial oficial de cada partido de la temporada.',
      rc_b1: 'Plantilla completa con fotos y números de camiseta',
      rc_b2: 'Alineaciones previas y registro de cambios en tiempo real',
      rc_b3: 'Tarjetas instantáneas del resultado para el chat del equipo',
      rc_btn: 'Obtener Turfy para Capitanes',
      ro_title: 'Organiza torneos locales profesionales',
      ro_desc: 'Elimina los cálculos manuales. Genera llaves, actualiza tablas de grupos al terminar cada juego y transmite en vivo con marcador OBS.',
      ro_b1: 'Calendarios de grupos y llaves eliminatorias automáticas',
      ro_b2: 'Integración de marcador en vivo para OBS Studio y Streamlabs',
      ro_b3: 'Reportes oficiales del torneo en PDF para patrocinadores y equipos',
      ro_btn: 'Obtener Turfy para Organizadores',
      extras_tag: 'Funciones Avanzadas',
      extras_title: 'Todo lo demás incluido en Turfy.',
      extras_desc: 'Más herramientas creadas específicamente para el fútbol base, sintético y amateur.',
      ex1_title: 'Marcador en Vivo para OBS Studio',
      ex1_desc: '¿Transmitiendo la final local? Toca el icono de transmisión en tu móvil, pega el enlace en OBS o Streamlabs como Navegador y obtén un marcador de TV en vivo.',
      ex2_title: 'Noticias de Fútbol en la App',
      ex2_desc: 'Mantente al día entre jornadas. Turfy muestra las últimas noticias, crónicas y análisis directamente en el feed de la aplicación.',
      ex3_title: 'Tarjetas para Redes Sociales',
      ex3_desc: '¿Terminó un partidazo? Turfy da formato al marcador final, goleadores y escudos en una imagen lista para WhatsApp, Instagram o Facebook.',
      steps_tag: 'Configuración Rápida',
      steps_title: 'Listo en 3 simples pasos.',
      steps_desc: 'Sin registros complicados. Puedes anotar tu primer partido en menos de 60 segundos.',
      step_1_title: 'Crea tu Partido',
      step_1_desc: 'Elige dos equipos, define la duración y selecciona la alineación o empieza de inmediato.',
      step_2_title: 'Anótalo en Vivo',
      step_2_desc: 'Toca para registrar goles, tarjetas y cambios mientras ocurren en la cancha.',
      step_3_title: 'Comparte y Exporta',
      step_3_desc: 'Genera una tarjeta de resumen para tu grupo de WhatsApp o exporta el acta completa en PDF.',
      faq_tag: '¿Tienes dudas?',
      faq_title: 'Preguntas Frecuentes',
      faq_desc: 'Respuestas claras a lo que más preguntan jugadores y organizadores.',
      faq_q1: '¿Es Turfy realmente 100% gratis?',
      faq_a1: 'Sí, completamente gratis. No hay suscripciones, compras dentro de la app ni anuncios. Todas las funciones — marcador en vivo, llaves de torneos, estadísticas, reportes PDF y overlay OBS — son gratis para siempre.',
      faq_q2: '¿Funciona Turfy sin conexión a internet?',
      faq_a2: 'Sí. Puedes anotar partidos y gestionar torneos en canchas sin señal móvil. Todo se guarda en tu teléfono y se sincroniza en la nube automáticamente al reconectarte.',
      faq_q3: '¿Qué formatos de torneo están disponibles?',
      faq_a3: 'Turfy soporta Liga (todos contra todos), Eliminatoria directa y Fase de Grupos + Eliminatorias (3 a 32 equipos). Los calendarios se generan solos y las tablas se actualizan al instante.',
      faq_q4: '¿Hay versión para iPhone / iOS?',
      faq_a4: 'Turfy está disponible actualmente para Android (5.0+). La versión para iPhone / iOS está en desarrollo — únete a la lista de espera en esta página para recibir aviso el día de su lanzamiento.',
      faq_q5: '¿Cómo funciona el marcador de transmisión en OBS Studio?',
      faq_a5: 'Genera el enlace de transmisión desde la app y pégalo en OBS Studio, Streamlabs o vMix como Fuente de Navegador (Browser Source). El marcador se actualiza en vivo en tu stream con cada gol o tarjeta.',
      faq_q6: '¿Puedo exportar actas de partidos y estadísticas a PDF?',
      faq_a6: 'Sí. Turfy genera actas de partidos y reportes de estadísticas en PDF con un solo toque, listos para imprimir o enviar por WhatsApp.',
      faq_q7: '¿Puedo usar Turfy para Fútbol 5, Fútbol 7, Futsal y canchas sintéticas?',
      faq_a7: 'Sí. Soporta Fútbol 5, 6, 7, 8, 9, Futsal, canchas sintéticas y Fútbol 11 con tiempos, tamaño de equipo y cambios configurables.',
      faq_q8: '¿Cómo siguen los jugadores y aficionados los resultados y tablas?',
      faq_a8: 'A medida que se anotan goles y tarjetas, los marcadores, tablas de posiciones, llaves y goleadores se actualizan automáticamente, además de las tarjetas visuales para WhatsApp e Instagram.',
      faq_q9: '¿Cómo funciona un torneo de 28 equipos (o de 3 a 32 equipos) con Grupos + Eliminatorias?',
      faq_a9: 'Turfy calcula grupos y llaves automáticamente de 3 a 32 equipos. Con 28 equipos, crea 7 grupos de 4 (42 partidos). Los 2 mejores de cada grupo (14 equipos) más los 2 mejores terceros (por Puntos, Diferencia de Goles y Goles a Favor) avanzan a los Octavos de Final de 16 equipos (57 partidos en total).',
      faq_q10: '¿Cuál es la mejor aplicación gratis para organizar torneos de fútbol?',
      faq_a10: 'Turfy combina marcador en vivo, cuadros automáticos de 3 a 32 equipos, estadísticas de carrera, actas en PDF y marcador para OBS Studio sin anuncios y sin suscripciones.',
      faq_q11: '¿En qué se diferencia Turfy de las hojas de cálculo o apps de pago?',
      faq_a11: 'A diferencia de Excel o apps que cobran por desbloquear eliminatorias o exportar PDF, Turfy es 100% gratis hasta 32 equipos, funciona sin internet y calcula desempates estilo FIFA automáticamente.',
      cta_title: 'Tu próximo día de partido <span class="lime">empieza aquí.</span>',
      cta_desc: 'Únete a futbolistas, capitanes y organizadores de torneos de todo el mundo que confían en Turfy. Gratis siempre. Sin anuncios. Funciona offline.',
      cta_btn_play: 'Descargar Turfy Gratis en Google Play',
      cta_btn_ios: 'Lista de Espera iPhone',
      qr_label: 'Escanea con tu móvil para instalar',
      contact_tag: 'Soporte y Comentarios',
      contact_title: 'Ponte en contacto con el equipo.',
      contact_desc: '¿Tienes alguna pregunta, sugerencia para tu torneo o comentario? Leemos todos los mensajes.',
      contact_lbl_name: 'Tu Nombre',
      contact_lbl_email: 'Correo Electrónico',
      contact_lbl_msg: 'Mensaje',
      contact_btn: 'Enviar Mensaje',
      contact_direct: 'O escríbenos directamente a',
      footer_tagline: 'La aplicación gratuita de marcador en vivo y torneos para el fútbol base y amateur en todo el mundo.',
      footer_col_app: 'App y Soluciones',
      footer_link_tm: 'Creador de Torneos y Llaves',
      footer_link_obs: 'Marcador en Vivo para OBS',
      footer_link_turf: 'Marcador Fútbol 5 y Fútbol 7',
      footer_col_legal: 'Contenido y Legal',
      footer_link_privacy: 'Política de Privacidad',
      footer_link_terms: 'Términos y Condiciones',
      footer_col_connect: 'Conectar',
      footer_social_desc: 'Sigue a Turfy en redes sociales para novedades y destacados.',
      footer_motto: 'Anota partidos. Organiza torneos. Registra tus estadísticas.',
      sticky_sub: 'Gratis · Sin anuncios · Offline',
      waitlist_tag: 'Muy Pronto',
      waitlist_title: 'Turfy para iPhone',
      waitlist_desc: 'Ingresa tu correo y te avisaremos en cuanto se lance la versión para iOS en la App Store. Sin spam.',
      waitlist_btn: 'Avísame en el Lanzamiento'
    },
    fr: {
      nav_features: 'Fonctionnalités',
      nav_roles: 'Pour qui',
      nav_how: 'Fonctionnement',
      nav_faq: 'FAQ',
      nav_news: 'Actualités',
      nav_contact: 'Contact',
      btn_download_free: 'Télécharger',
      btn_get_google_play: 'Télécharger Turfy sur Google Play',
      hero_tag: 'Score en Direct & Tournois Gratuits',
      hero_title: 'Scorez vos matchs.<br>Gérez vos tournois.<br><span class="lime">Suivez chaque stat.</span>',
      hero_desc: 'Conçu pour le <strong>Five (5v5), Foot à 7, Futsal, académies et ligues 11v11</strong>. Créez des tournois de 3 à 32 équipes, diffusez avec un scoreboard OBS et suivez les stats hors ligne.',
      pill_1: 'Tournois de 3 à 32 Équipes',
      pill_2: '100% Hors Ligne',
      pill_3: 'Overlay OBS Gratuit',
      pill_4: '5v5 · 7v7 · Futsal · 11v11',
      btn_play_sub: 'Disponible sur',
      ios_waitlist_cta: 'iPhone bientôt · <strong>M’alerter</strong>',
      rating_text: '<strong>5.0</strong> sur Google Play · 100% Gratuit · Sans Pub',
      check_free: '100% Gratuit',
      check_noads: 'Sans pub',
      check_offline: 'Mode hors ligne',
      trust_1_title: 'Score en Direct en 1 Clic',
      trust_1_sub: 'Buts, cartons et remplacements',
      trust_2_title: 'Tournois Automatisés',
      trust_2_sub: 'Championnat, poules et élimination',
      trust_3_title: 'Stats & Rapports PDF',
      trust_3_sub: 'Fiches de match et classements',
      trust_4_title: 'Mode 100% Hors Ligne',
      trust_4_sub: 'Fonctionne sans réseau sur le terrain',
      features_tag: 'Fonctionnalités Clés',
      features_title: 'Tout ce qu’il vous faut le jour du match.',
      features_desc: 'Conçu pour remplacer les groupes WhatsApp chaotiques, les carnets perdus et les tableaux manuels.',
      f1_tag: 'Fonction #1',
      f1_title: 'Score de Match en Direct',
      f1_desc: 'Un geste pour noter un but, carton, passe décisive ou remplacement. Chronomètre, prolongations et pauses inclus.',
      f1_b1: '<strong>Boutons rapides :</strong> But, Remplacement, Carton, Pause et Annuler.',
      f1_b2: '<strong>Marquage des joueurs :</strong> Identifiez le buteur et le passeur en un clic.',
      f1_b3: '<strong>Phases de jeu :</strong> Suivi automatique 1re mi-temps, 2e mi-temps et prolongations.',
      f1_btn: 'Essayer le Score en Direct →',
      f2_tag: 'Fonction #2',
      f2_title: 'Tournois Automatisés',
      f2_desc: 'Créez votre tournoi en quelques minutes. Le calendrier est généré automatiquement et les classements se mettent à jour en direct.',
      f2_b1: '<strong>Formats multiples :</strong> Championnat, Poules + Phase finale, Élimination directe.',
      f2_b2: '<strong>Classements live :</strong> Points, victoires, différence de buts calculés automatiquement.',
      f2_b3: '<strong>Tableaux finaux :</strong> L’arbre à élimination directe avance automatiquement.',
      f2_btn: 'Créer un Tournoi →',
      f3_tag: 'Fonction #3',
      f3_title: 'Stats Joueurs & Rapports PDF',
      f3_desc: 'Chaque but, passe, carton et match joué est enregistré sur le profil du joueur. Exportez des feuilles de match PDF en un clic.',
      f3_b1: '<strong>Stats en carrière :</strong> Buts, passes décisives, clean sheets et cartons.',
      f3_b2: '<strong>PDF en 1 clic :</strong> Partagez les feuilles de match avec coachs et sponsors.',
      f3_b3: '<strong>Classement des buteurs :</strong> Suivi automatique du Soulier d’Or du tournoi.',
      f3_btn: 'Suivre vos Statistiques →',
      roles_tag: 'Expérience sur Mesure',
      roles_title: 'Conçu pour tous les acteurs du terrain.',
      roles_desc: 'Choisissez votre rôle pour découvrir comment Turfy simplifie vos matchs.',
      role_tab_player: 'Joueurs',
      role_tab_captain: 'Capitaines',
      role_tab_organizer: 'Organisateurs',
      rp_title: 'Suivez votre parcours footballistique',
      rp_desc: 'Ne débattez plus sur qui a marqué ou fait le plus de passes. Vos statistiques sont enregistrées en temps réel sur votre profil.',
      rp_b1: 'Compteur personnel de buts, passes et cartons',
      rp_b2: 'Rejoignez plusieurs équipes avec un code d’invitation',
      rp_b3: 'Cartes de résumé formatées pour WhatsApp et Instagram',
      rp_btn: 'Télécharger Turfy pour Joueurs',
      rc_title: 'Gérez votre équipe sans tableurs',
      rc_desc: 'Définissez votre onze de départ, suivez les remplacements en direct et gardez l’historique officiel de toute la saison.',
      rc_b1: 'Effectif complet avec photos et numéros de maillot',
      rc_b2: 'Compositions d’avant-match et changements en temps réel',
      rc_b3: 'Cartes de résultat instantanées pour le groupe de l’équipe',
      rc_btn: 'Télécharger Turfy pour Capitaines',
      ro_title: 'Organisez des tournois locaux professionnels',
      ro_desc: 'Fini les calculs manuels. Générez les tableaux, mettez à jour les poules automatiquement et diffusez en direct avec un overlay OBS.',
      ro_b1: 'Calendriers de poules et arbres à élimination automatiques',
      ro_b2: 'Intégration de tableau de score en direct OBS / Streamlabs',
      ro_b3: 'Rapports officiels de tournoi en PDF pour sponsors et clubs',
      ro_btn: 'Télécharger Turfy pour Organisateurs',
      extras_tag: 'Outils Avancés',
      extras_title: 'Encore plus de puissance dans Turfy.',
      extras_desc: 'Des outils pensés spécialement pour le football amateur, le Five et les académies.',
      ex1_title: 'Scoreboard OBS en Direct',
      ex1_desc: 'Vous diffusez la finale ? Copiez le lien depuis votre téléphone dans OBS ou Streamlabs (Browser Source) pour afficher un score TV en direct.',
      ex2_title: 'Actualités Foot dans l’App',
      ex2_desc: 'Restez informé entre les matchs. Turfy intègre les dernières actualités et résumés directement dans votre fil.',
      ex3_title: 'Cartes Sociales Partageables',
      ex3_desc: 'Un match à suspense ? Turfy met en page le score final, les buteurs et les blasons pour WhatsApp, Instagram ou Facebook.',
      steps_tag: 'Démarrage Rapide',
      steps_title: 'Prêt en 3 étapes simples.',
      steps_desc: 'Aucune configuration complexe. Scorez votre premier match en 60 secondes.',
      step_1_title: 'Créez votre Match',
      step_1_desc: 'Choisissez deux équipes, la durée du match et votre composition.',
      step_2_title: 'Scorez en Direct',
      step_2_desc: 'Enregistrez buts, cartons et changements au bord du terrain.',
      step_3_title: 'Partagez & Exportez',
      step_3_desc: 'Générez un visuel pour WhatsApp ou exportez la feuille de match complète en PDF.',
      faq_tag: 'Des Questions ?',
      faq_title: 'Questions Fréquentes',
      faq_desc: 'Réponses claires aux questions les plus posées avant le téléchargement.',
      faq_q1: 'Turfy est-il vraiment 100 % gratuit ?',
      faq_a1: 'Oui, totalement gratuit. Aucun abonnement, aucun achat intégré et zéro publicité. Toutes les fonctionnalités sont gratuites pour toujours.',
      faq_q2: 'Turfy fonctionne-t-il hors ligne sans internet ?',
      faq_a2: 'Oui. Vous pouvez scorer vos matchs et gérer vos tournois sur des terrains sans réseau. Tout est sauvegardé localement et synchronisé dès le retour de la connexion.',
      faq_q3: 'Quels formats de tournoi sont pris en charge ?',
      faq_a3: 'Championnat (Round Robin), Élimination directe et Phase de poules + Playoffs (de 3 à 32 équipes) avec classements en direct.',
      faq_q4: 'Existe-t-il une version iPhone / iOS ?',
      faq_a4: 'Turfy est disponible sur Android (5.0+). La version iOS est en cours de développement — rejoignez la liste d’attente sur cette page.',
      faq_q5: 'Comment fonctionne le scoreboard OBS en direct ?',
      faq_a5: 'Générez un lien de diffusion dans l’application et collez-le dans OBS Studio ou Streamlabs comme source navigateur. Le score se met à jour en direct.',
      faq_q6: 'Puis-je exporter les feuilles de match et statistiques en PDF ?',
      faq_a6: 'Oui, exportez des rapports PDF professionnels en un clic pour les partager sur WhatsApp ou les imprimer.',
      faq_q7: 'Puis-je utiliser Turfy pour le Five (5v5), Foot à 7, Futsal et Foot à 11 ?',
      faq_a7: 'Oui. Turfy prend en charge le 5v5, 6v6, 7v7, 8v8, 9v9, le Futsal et le 11v11 avec durées et remplacements personnalisables.',
      faq_q8: 'Comment les joueurs et supporters suivent-ils les scores et classements ?',
      faq_a8: 'Les scores, classements de poules, tableaux finaux et le classement des buteurs se mettent à jour automatiquement.',
      faq_q9: 'Comment fonctionne un tournoi à 28 équipes (ou 3 à 32 équipes) Poules + Phase finale ?',
      faq_a9: 'Avec 28 équipes, Turfy crée 7 poules de 4 (42 matchs). Les 2 premiers de chaque poule (14 équipes) + les 2 meilleurs 3es (Points, Différence de buts, Buts marqués) se qualifient pour les 8es de finale à 16 équipes (57 matchs au total).',
      faq_q10: 'Quelle est la meilleure application gratuite pour organiser un tournoi de foot ?',
      faq_a10: 'Turfy réunit le score en direct, les tableaux automatiques de 3 à 32 équipes, les stats joueurs, les rapports PDF et l’overlay OBS gratuitement et sans publicité.',
      faq_q11: 'Quelle différence entre Turfy et un fichier Excel ou une app payante ?',
      faq_a11: 'Contrairement aux tableurs manuels ou aux applications qui bloquent les phases finales derrière un abonnement, Turfy est 100 % gratuit jusqu’à 32 équipes et fonctionne hors ligne.',
      cta_title: 'Votre prochain match <span class="lime">commence ici.</span>',
      cta_desc: 'Rejoignez les joueurs, capitaines et organisateurs du monde entier. 100% Gratuit. Sans pub. Hors ligne.',
      cta_btn_play: 'Télécharger Turfy sur Google Play',
      cta_btn_ios: 'Liste d’attente iPhone',
      qr_label: 'Scannez avec votre téléphone',
      contact_tag: 'Support & Avis',
      contact_title: 'Contactez notre équipe.',
      contact_desc: 'Une question ou une suggestion pour votre tournoi ? Nous lisons chaque message.',
      contact_lbl_name: 'Votre Nom',
      contact_lbl_email: 'Adresse E-mail',
      contact_lbl_msg: 'Message',
      contact_btn: 'Envoyer le Message',
      contact_direct: 'Ou écrivez-nous directement à',
      footer_tagline: 'L’application gratuite de score en direct et de tournois pour le football amateur.',
      footer_col_app: 'App & Solutions',
      footer_link_tm: 'Créateur de Tournois',
      footer_link_obs: 'Overlay Scoreboard OBS',
      footer_link_turf: 'Scoreur Five 5v5 & Foot à 7',
      footer_col_legal: 'Contenu & Légal',
      footer_link_privacy: 'Politique de Confidentialité',
      footer_link_terms: 'Conditions d’Utilisation',
      footer_col_connect: 'Suivez-nous',
      footer_social_desc: 'Suivez Turfy sur les réseaux sociaux.',
      footer_motto: 'Scorez vos matchs. Gérez vos tournois. Suivez vos stats.',
      sticky_sub: 'Gratuit · Sans pub · Hors ligne',
      waitlist_tag: 'Bientôt Disponible',
      waitlist_title: 'Turfy pour iPhone',
      waitlist_desc: 'Entrez votre e-mail et nous vous préviendrons dès la sortie de la version iOS sur l’App Store.',
      waitlist_btn: 'M’alerter au Lancement'
    },
    de: {
      nav_features: 'Funktionen',
      nav_roles: 'Für wen',
      nav_how: 'Ablauf',
      nav_faq: 'FAQ',
      nav_news: 'News',
      nav_contact: 'Kontakt',
      btn_download_free: 'Gratis Laden',
      btn_get_google_play: 'Turfy bei Google Play laden',
      hero_tag: 'Fußball-Liveticker & Turnier-App',
      hero_title: 'Spiele live tracken.<br>Turniere verwalten.<br><span class="lime">Jede Statistik sichern.</span>',
      hero_desc: 'Entwickelt für <strong>Kleinfeld (5v5, 7v7), Futsal, Akademien und 11v11-Ligen</strong>. Erstelle Turniere mit 3–32 Teams, nutze das Live-OBS-Scoreboard und tracke alle Spielerstatistiken offline.',
      pill_1: '3–32 Teams Turniere',
      pill_2: '100% Offline nutzbar',
      pill_3: 'Gratis OBS Live-Overlay',
      pill_4: '5v5 · 7v7 · Futsal · 11v11',
      btn_play_sub: 'Jetzt bei',
      ios_waitlist_cta: 'iPhone bald verfügbar · <strong>Benachrichtigen</strong>',
      rating_text: '<strong>5.0</strong> bei Google Play · 100% Kostenlos · Werbefrei',
      check_free: 'Dauerhaft kostenlos',
      check_noads: 'Keine Werbung',
      check_offline: 'Offline-Modus',
      trust_1_title: 'Live-Scoring per Fingertipp',
      trust_1_sub: 'Tore, Karten & Wechsel in Echtzeit',
      trust_2_title: 'Automatische Turniere',
      trust_2_sub: 'Liga, Gruppenphase & K.o.-Runden',
      trust_3_title: 'Statistiken & PDF-Berichte',
      trust_3_sub: 'Spielerkarten & teilbare Ergebnisse',
      trust_4_title: '100% Offline-Modus',
      trust_4_sub: 'Funktioniert auch ohne Netz am Platz',
      features_tag: 'Kernfunktionen',
      features_title: 'Alles, was du am Spieltag brauchst.',
      features_desc: 'Ersetzt unübersichtliche Gruppenchats, verlorene Notizblöcke und manuelle Tabellen.',
      f1_tag: 'Funktion #1',
      f1_title: 'Live-Spielstand & Ticker',
      f1_desc: 'Erfasse Tore, Karten, Vorlagen und Wechsel mit einem Tipp. Spieluhr, Nachspielzeit und Halbzeitpause inklusive.',
      f1_b1: '<strong>Schnelltasten:</strong> Tor, Wechsel, Karte, Pause und Rückgängig.',
      f1_b2: '<strong>Spieler-Tagging:</strong> Torschützen und Vorlagengeber sofort markieren.',
      f1_b3: '<strong>Spielphasen:</strong> Automatische 1. Halbzeit, 2. Halbzeit und Verlängerung.',
      f1_btn: 'Live-Scoring Gratis testen →',
      f2_tag: 'Funktion #2',
      f2_title: 'Automatisierte Turniere',
      f2_desc: 'Erstelle dein Turnier in Minuten. Spielpläne werden automatisch generiert und Tabellen berechnen Punkte und Tordifferenz live.',
      f2_b1: '<strong>Alle Formate:</strong> Jeder-gegen-Jeden, Gruppenphase + K.o.-Baum.',
      f2_b2: '<strong>Live-Tabellen:</strong> Punkte, Siege und Tordifferenz automatisch berechnet.',
      f2_b3: '<strong>K.o.-Baum:</strong> Gewinner rücken automatisch in die nächste Runde vor.',
      f2_btn: 'Turnier erstellen →',
      f3_tag: 'Funktion #3',
      f3_title: 'Spielerstatistiken & PDF-Export',
      f3_desc: 'Jedes Tor, jede Vorlage und jede Karte bleibt im Spielerprofil gespeichert. Exportiere PDF-Spielberichte mit einem Tipp.',
      f3_b1: '<strong>Karriere-Stats:</strong> Tore, Assists, Zu-Null-Spiele und Kartenhistorie.',
      f3_b2: '<strong>1-Klick-PDF:</strong> Druckfertige Spielberichte für Trainer und Sponsoren.',
      f3_b3: '<strong>Torschützenliste:</strong> Automatisches Ranking für die Torjägerkanone.',
      f3_btn: 'Statistiken tracken →',
      roles_tag: 'Für Jeden auf dem Platz',
      roles_title: 'Gebaut für Spieler, Kapitäne und Veranstalter.',
      roles_desc: 'Wähle deine Rolle und sieh, wie Turfy deinen Spieltag einfacher macht.',
      role_tab_player: 'Spieler',
      role_tab_captain: 'Teamkapitäne',
      role_tab_organizer: 'Turnierleiter',
      rp_title: 'Verfolge deine persönliche Fußballkarriere',
      rp_desc: 'Keine Diskussionen mehr darüber, wer getroffen oder vorbereitet hat. Alle Statistiken werden live in deinem Profil gespeichert.',
      rp_b1: 'Persönliche Tor-, Assist- und Kartenbilanz',
      rp_b2: 'Mehrere Teams per Einladungscode beitreten',
      rp_b3: 'Spieltags-Grafiken für WhatsApp und Instagram teilen',
      rp_btn: 'Turfy für Spieler laden',
      rc_title: 'Verwalte dein Team ohne Tabellenkalkulation',
      rc_desc: 'Lege Startaufstellungen fest, protokolliere Wechsel im Spiel und behalte alle Ergebnisse der Saison im Blick.',
      rc_b1: 'Kompletter Kader mit Fotos und Rückennummern',
      rc_b2: 'Startaufstellungen und Live-Einwechslungen',
      rc_b3: 'Sofortige Ergebnis-Karten für den Team-Chat',
      rc_btn: 'Turfy für Kapitäne laden',
      ro_title: 'Organisiere professionelle Turniere',
      ro_desc: 'Keine manuelle Rechnerei mehr. Spielpläne, Gruppentabellen und K.o.-Runden aktualisieren sich automatisch inklusive OBS-Scoreboard.',
      ro_b1: 'Automatische Gruppen- und K.o.-Turnierbäume',
      ro_b2: 'Live-Scoreboard-Overlay für OBS Studio & Streamlabs',
      ro_b3: 'Offizielle PDF-Turnierberichte für Sponsoren und Teams',
      ro_btn: 'Turfy für Veranstalter laden',
      extras_tag: 'Power-Features',
      extras_title: 'Noch mehr Werkzeuge in Turfy.',
      extras_desc: 'Speziell entwickelt für Amateurfußball, Kleinfeld und Vereine.',
      ex1_title: 'Live-OBS-Scoreboard-Overlay',
      ex1_desc: 'Du streamst das Finale? Link in OBS oder Streamlabs als Browser-Quelle einfügen und der Spielstand aktualisiert sich live im Stream.',
      ex2_title: 'Fußball-News in der App',
      ex2_desc: 'Bleib zwischen den Spieltagen auf dem Laufenden mit aktuellen Fußball-News direkt im App-Feed.',
      ex3_title: 'Social-Media-Spielkarten',
      ex3_desc: 'Spannendes Spiel beendet? Teile den Endstand samt Torschützen und Wappen direkt auf WhatsApp oder Instagram.',
      steps_tag: 'Schnellstart',
      steps_title: 'Startklar in 3 einfachen Schritten.',
      steps_desc: 'In weniger als 60 Sekunden kannst du dein erstes Spiel live tracken.',
      step_1_title: 'Spiel erstellen',
      step_1_desc: 'Zwei Teams wählen, Spielzeit festlegen und direkt anpfeifen.',
      step_2_title: 'Live mittracken',
      step_2_desc: 'Tore, Karten und Wechsel direkt am Spielfeldrand antippen.',
      step_3_title: 'Teilen & Exportieren',
      step_3_desc: 'Match-Card auf WhatsApp teilen oder vollständigen PDF-Bericht exportieren.',
      faq_tag: 'Fragen?',
      faq_title: 'Häufig gestellte Fragen',
      faq_desc: 'Klare Antworten auf die wichtigsten Fragen vor dem Download.',
      faq_q1: 'Ist Turfy wirklich 100 % kostenlos?',
      faq_a1: 'Ja, komplett kostenlos. Keine Abos, keine In-App-Käufe und null Werbung. Alle Funktionen inklusive Turnierbäumen, PDF-Export und OBS-Overlay sind dauerhaft gratis.',
      faq_q2: 'Funktioniert Turfy auch offline ohne Internet?',
      faq_a2: 'Ja. Du kannst Spiele und Turniere auf Plätzen ohne Empfang komplett offline verwalten. Sobald wieder Netz da ist, synchronisiert sich alles automatisch.',
      faq_q3: 'Welche Turnierformate werden unterstützt?',
      faq_a3: 'Liga (Jeder-gegen-Jeden), K.o.-System und Gruppenphase + K.o.-Runde (3 bis 32 Teams) mit automatischer Live-Tabelle.',
      faq_q4: 'Gibt es eine iPhone / iOS-Version?',
      faq_a4: 'Turfy ist aktuell für Android (ab 5.0) verfügbar. Die iOS-Version ist in Arbeit – trag dich hier auf die Warteliste ein.',
      faq_q5: 'Wie funktioniert das OBS-Scoreboard-Overlay?',
      faq_a5: 'Erzeuge in der App den Broadcast-Link und füge ihn in OBS Studio oder Streamlabs als Browser-Quelle ein. Jedes Tor wird sofort im Livestream angezeigt.',
      faq_q6: 'Kann ich Spielberichte und Statistiken als PDF exportieren?',
      faq_a6: 'Ja, mit einem Tipp erstellst du druckfertige PDF-Spielbögen und Turnierübersichten zum Teilen per WhatsApp oder E-Mail.',
      faq_q7: 'Eignet sich Turfy für 5v5, 7v7 Kleinfeld, Futsal und 11v11?',
      faq_a7: 'Ja, alle Kleinfeld-, Hallen-, Futsal- und 11v11-Formate mit individueller Spielzeit und fliegenden Wechseln werden unterstützt.',
      faq_q8: 'Wie verfolgen Spieler und Fans Live-Spielstände und Tabellen?',
      faq_a8: 'Tabellen, K.o.-Bäume und Torschützenlisten aktualisieren sich nach jedem Treffer automatisch.',
      faq_q9: 'Wie funktioniert ein 28-Team-Turnier (oder 3 bis 32 Teams) mit Gruppen + K.o.-Phase?',
      faq_a9: 'Bei 28 Teams erstellt Turfy automatisch 7 Vierergruppen (42 Gruppenspiele). Die Top 2 jeder Gruppe (14 Teams) sowie die 2 besten Gruppendritten (nach Punkten, Tordifferenz und Toren) ziehen ins Achtelfinale (16 Teams) ein.',
      faq_q10: 'Was ist die beste kostenlose App für Fußballturniere?',
      faq_a10: 'Turfy vereint Live-Ticker, automatische 3–32-Team-Turnierpläne, Spielerstatistiken, PDF-Export und OBS-Livestream-Overlays komplett kostenlos und werbefrei.',
      faq_q11: 'Wie unterscheidet sich Turfy von Excel oder kostenpflichtigen Turnier-Apps?',
      faq_a11: 'Im Gegensatz zu Excel oder Apps mit Bezahlschranken ist Turfy für bis zu 32 Teams komplett gratis, funktioniert offline und berechnet alle FIFA-Tiebreaker automatisch.',
      cta_title: 'Dein nächster Spieltag <span class="lime">startet hier.</span>',
      cta_desc: '100% Kostenlos. Keine Werbung. Funktioniert komplett offline.',
      cta_btn_play: 'Turfy Gratis bei Google Play laden',
      cta_btn_ios: 'iPhone-Warteliste',
      qr_label: 'Mit dem Handy scannen zum Installieren',
      contact_tag: 'Support & Feedback',
      contact_title: 'Kontaktiere unser Team.',
      contact_desc: 'Fragen oder Wünsche für dein Turnier? Wir lesen jede Nachricht.',
      contact_lbl_name: 'Dein Name',
      contact_lbl_email: 'E-Mail-Adresse',
      contact_lbl_msg: 'Nachricht',
      contact_btn: 'Nachricht senden',
      contact_direct: 'Oder direkt per E-Mail an',
      footer_tagline: 'Der kostenlose Spiel- und Turnier-Tracker für den Amateurfußball weltweit.',
      footer_col_app: 'App & Lösungen',
      footer_link_tm: 'Turnierplan-Generator',
      footer_link_obs: 'OBS Live-Scoreboard',
      footer_link_turf: '5v5 & 7v7 Kleinfeld-Ticker',
      footer_col_legal: 'Inhalt & Rechtliches',
      footer_link_privacy: 'Datenschutz',
      footer_link_terms: 'Nutzungsbedingungen',
      footer_col_connect: 'Folge uns',
      footer_social_desc: 'Folge Turfy auf Social Media für Updates.',
      footer_motto: 'Spiele tracken. Turniere leiten. Statistiken sichern.',
      sticky_sub: 'Gratis · Werbefrei · Offline',
      waitlist_tag: 'Bald Verfügbar',
      waitlist_title: 'Turfy für iPhone',
      waitlist_desc: 'Trage deine E-Mail-Adresse ein und wir benachrichtigen dich sofort zum iOS App Store Start.',
      waitlist_btn: 'Zum Start benachrichtigen'
    },
    tr: {
      nav_features: 'Özellikler',
      nav_roles: 'Kimler İçin',
      nav_how: 'Nasıl Çalışır',
      nav_faq: 'SSS',
      nav_news: 'Haberler',
      nav_contact: 'İletişim',
      btn_download_free: 'Ücretsiz İndir',
      btn_get_google_play: 'Google Play’den İndir',
      hero_tag: 'Ücretsiz Maç Takibi ve Turnuva Uygulaması',
      hero_title: 'Maçları canlı skorla.<br>Turnuva düzenle.<br><span class="lime">Her istatistiği tut.</span>',
      hero_desc: '<strong>Halı saha (5v5, 6v6, 7v7), futsal, akademiler ve amatör ligler</strong> için geliştirildi. 3–32 takımlı grup ve eleme fikstürleri oluşturun, OBS canlı skor tabelasıyla yayın yapın ve çevrimdışı kullanın.',
      pill_1: '3–32 Takımlı Turnuvalar',
      pill_2: '%100 Çevrimdışı Çalışır',
      pill_3: 'Ücretsiz OBS Canlı Tabela',
      pill_4: '5v5 · 7v7 Halı Saha · Futsal · 11v11',
      btn_play_sub: 'Hemen İndirin',
      ios_waitlist_cta: 'iPhone yakında · <strong>Haberdar ol</strong>',
      rating_text: 'Google Play’de <strong>5.0</strong> · %100 Ücretsiz · Reklamsız',
      check_free: 'Sonsuza dek ücretsiz',
      check_noads: 'Reklamsız',
      check_offline: 'İnternetsiz çalışır',
      trust_1_title: 'Tek Dokunuşla Canlı Skor',
      trust_1_sub: 'Goller, kartlar ve oyuncu değişiklikleri',
      trust_2_title: 'Otomatik Turnuvalar',
      trust_2_sub: 'Lig usulü, gruplar ve eleme turları',
      trust_3_title: 'İstatistik ve PDF Raporları',
      trust_3_sub: 'Oyuncu kartları ve paylaşılabilir maç özeti',
      trust_4_title: '%100 Çevrimdışı Mod',
      trust_4_sub: 'İnternet çekmeyen sahalarda bile çalışır',
      features_tag: 'Temel Özellikler',
      features_title: 'Maç günü ihtiyacınız olan her şey.',
      features_desc: 'Karışık WhatsApp gruplarını, kaybolan not defterlerini ve manuel puan tablolarını tek dokunuşla değiştirin.',
      f1_tag: 'Özellik #1',
      f1_title: 'Canlı Maç Skorlama',
      f1_desc: 'Gol, kart, asist veya oyuncu değişikliğini tek dokunuşla kaydedin. Maç kronometresi, uzatmalar ve devre arası dahildir.',
      f1_b1: '<strong>Anında butonlar:</strong> Gol, Değişiklik, Kart, Duraklat ve Geri Al.',
      f1_b2: '<strong>Oyuncu etiketleme:</strong> Golü kimin attığını ve asisti kimin yaptığını seçin.',
      f1_b3: '<strong>Maç devreleri:</strong> 1. Devre, 2. Devre ve Uzatma takibi.',
      f1_btn: 'Canlı Skorlamayı Ücretsiz Dene →',
      f2_tag: 'Özellik #2',
      f2_title: 'Otomatik Turnuva Yönetimi',
      f2_desc: 'Turnuvanızı dakikalar içinde kurun. Fikstürler otomatik oluşur; puan durumu ve averaj anında hesaplanır.',
      f2_b1: '<strong>Çoklu formatlar:</strong> Lig Usulü, Eleme, Grup + Finaller (3–32 takım).',
      f2_b2: '<strong>Canlı puan tablosu:</strong> Puan, galibiyet ve averaj otomatik güncellenir.',
      f2_b3: '<strong>Eleme ağacı:</strong> Kazanan takımlar üst tura otomatik yükselir.',
      f2_btn: 'Turnuva Oluştur →',
      f3_tag: 'Özellik #3',
      f3_title: 'Oyuncu İstatistikleri ve PDF Raporları',
      f3_desc: 'Her gol, asist ve kart oyuncunun profiline işlenir. Tek dokunuşla profesyonel PDF maç raporları alın.',
      f3_b1: '<strong>Kariyer istatistikleri:</strong> Goller, asistler, gol yemeden bitirilen maçlar.',
      f3_b2: '<strong>Tek tıkla PDF:</strong> Yazdırılabilir maç raporlarını WhatsApp’tan paylaşın.',
      f3_b3: '<strong>Gol krallığı tablosu:</strong> Turnuvanın en golcü oyuncularını otomatik takip edin.',
      f3_btn: 'İstatistiklerini Takip Et →',
      roles_tag: 'Kişiselleştirilmiş Deneyim',
      roles_title: 'Sahadaki herkes için tasarlandı.',
      roles_desc: 'Turfy’nin maç gününüzü nasıl kolaylaştırdığını görmek için rolünüzü seçin.',
      role_tab_player: 'Oyuncular',
      role_tab_captain: 'Kaptanlar',
      role_tab_organizer: 'Organizatörler',
      rp_title: 'Kişisel futbol kariyerinizi takip edin',
      rp_desc: 'Kimin daha çok gol veya asist yaptığını tartışmaya son verin. İstatistikleriniz anında profilinize kaydedilir.',
      rp_b1: 'Kişisel gol, asist ve kart istatistikleri',
      rp_b2: 'Davet koduyla birden fazla takıma katılın',
      rp_b3: 'WhatsApp ve Instagram için hazır maç özeti kartları',
      rp_btn: 'Oyuncular İçin Turfy İndir',
      rc_title: 'Takımınızı tablolara boğulmadan yönetin',
      rc_desc: 'İlk 11 kadrosunu kurun, maç içi oyuncu değişikliklerini kaydedin ve tüm sezonun maç geçmişini tutun.',
      rc_b1: 'Fotoğraflı ve forma numaralı tam takım kadrosu',
      rc_b2: 'Maç öncesi diziliş ve canlı değişiklik kaydı',
      rc_b3: 'Takım grubunuz için anında maç sonuç kartları',
      rc_btn: 'Kaptanlar İçin Turfy İndir',
      ro_title: 'Profesyonel yerel turnuvalar düzenleyin',
      ro_desc: 'Manuel hesaplamaları unutun. Fikstürleri otomatik oluşturun, grup puanlarını anında güncelleyin ve OBS skor tabelasıyla canlı yayın yapın.',
      ro_b1: 'Otomatik lig usulü ve eleme fikstürleri',
      ro_b2: 'OBS Studio ve Streamlabs canlı skor tabelası entegrasyonu',
      ro_b3: 'Sponsorlar ve takımlar için resmi PDF turnuva raporları',
      ro_btn: 'Organizatörler İçin Turfy İndir',
      extras_tag: 'Güçlü Araçlar',
      extras_title: 'Turfy içindeki diğer tüm özellikler.',
      extras_desc: 'Halı saha, amatör kulüpler ve yerel turnuvalar için özel araçlar.',
      ex1_title: 'Canlı OBS Skor Tabelası',
      ex1_desc: 'Final maçını canlı mı yayınlıyorsunuz? Yayın bağlantısını OBS veya Streamlabs’e yapıştırın, skor tabelası canlı güncellensin.',
      ex2_title: 'Uygulama İçi Futbol Haberleri',
      ex2_desc: 'Maçlar arasında güncel kalın. En son futbol haberleri ve maç raporları doğrudan uygulama akışınızda.',
      ex3_title: 'Paylaşılabilir Sosyal Medya Kartları',
      ex3_desc: 'Maç bittiğinde skoru, gol atanları ve takım logolarını içeren şık maç kartını WhatsApp veya Instagram’da paylaşın.',
      steps_tag: 'Hızlı Kurulum',
      steps_title: '3 basit adımda hazır.',
      steps_desc: '60 saniye içinde ilk maçınızı canlı skorlamaya başlayabilirsiniz.',
      step_1_title: 'Maçınızı Oluşturun',
      step_1_desc: 'İki takım seçin, maç süresini belirleyin ve hemen başlayın.',
      step_2_title: 'Canlı Kaydedin',
      step_2_desc: 'Saha kenarından golleri, kartları ve değişiklikleri anında girin.',
      step_3_title: 'Paylaşın ve PDF Alın',
      step_3_desc: 'WhatsApp grubunuz için maç kartı oluşturun veya tam PDF raporu indirin.',
      faq_tag: 'Sorularınız mı var?',
      faq_title: 'Sıkça Sorulan Sorular',
      faq_desc: 'Oyuncuların ve organizatörlerin en çok merak ettiği soruların yanıtları.',
      faq_q1: 'Turfy gerçekten %100 ücretsiz mi?',
      faq_a1: 'Evet, tamamen ücretsiz. Abonelik yok, uygulama içi satın alma yok ve reklam yok. Tüm özellikler sonsuza dek ücretsizdir.',
      faq_q2: 'Turfy internet olmadan çevrimdışı çalışır mı?',
      faq_a2: 'Evet. Şebeke çekmeyen sahalarda maçları skorlayabilir ve turnuva yönetebilirsiniz. İnternete bağlandığınızda otomatik senkronize olur.',
      faq_q3: 'Hangi turnuva formatları destekleniyor?',
      faq_a3: 'Lig usulü, tek maç eleme ve Grup + Eleme (3 ila 32 takım) formatları otomatik fikstür ve canlı puan tablosuyla desteklenir.',
      faq_q4: 'iPhone / iOS sürümü var mı?',
      faq_a4: 'Turfy şu anda Android (5.0+) için mevcuttur. iOS sürümü geliştirilmektedir — bu sayfadaki bekleme listesine katılabilirsiniz.',
      faq_q5: 'OBS canlı yayın skor tabelası nasıl çalışır?',
      faq_a5: 'Uygulamadan yayın linkini kopyalayıp OBS Studio veya Streamlabs’e Tarayıcı Kaynağı olarak ekleyin. Telefondan girdiğiniz her gol yayında anında görünür.',
      faq_q6: 'Maç raporlarını ve istatistikleri PDF olarak indirebilir miyim?',
      faq_a6: 'Evet, tek dokunuşla yazdırılabilir PDF maç kağıtları ve turnuva istatistikleri oluşturup WhatsApp’tan paylaşabilirsiniz.',
      faq_q7: 'Halı saha (5v5, 6v6, 7v7), futsal ve 11v11 maçlar için uygun mu?',
      faq_a7: 'Evet. Özelleştirilebilir devre süreleri ve oyuncu sayılarıyla tüm halı saha, futsal ve 11v11 maçlarını destekler.',
      faq_q8: 'Oyuncular ve taraftarlar canlı skorları ve puan durumunu nasıl takip eder?',
      faq_a8: 'Goller kaydedildikçe puan tabloları, eleme ağacı ve gol krallığı otomatik güncellenir.',
      faq_q9: '28 takımlı (veya 3–32 takımlı) Grup + Eleme turnuvası nasıl çalışır?',
      faq_a9: '28 takımda Turfy 4’erli 7 grup oluşturur (42 maç). Her grubun ilk 2 takımı (14 takım) + Puan, Averaj ve Gol sayısına göre en iyi 2 üçüncü takım Son 16 turuna yükselir (toplam 57 maç).',
      faq_q10: 'Futbol turnuvası düzenlemek için en iyi ücretsiz uygulama hangisi?',
      faq_a10: 'Turfy; canlı maç skorlama, 3–32 takımlı otomatik fikstür, oyuncu istatistikleri, PDF raporları ve OBS yayın tabelasını reklamsız ve ücretsiz sunar.',
      faq_q11: 'Turfy’nin Excel veya ücretli uygulamalardan farkı nedir?',
      faq_a11: 'Eleme turlarını veya PDF çıktısını ücretli yapan uygulamaların aksine Turfy 32 takıma kadar tamamen ücretsizdir ve çevrimdışı çalışır.',
      cta_title: 'Bir sonraki maç gününüz <span class="lime">burada başlıyor.</span>',
      cta_desc: 'Sonsuza dek ücretsiz. Reklamsız. İnternetsiz çalışır.',
      cta_btn_play: 'Google Play’den Ücretsiz İndir',
      cta_btn_ios: 'iPhone Bekleme Listesi',
      qr_label: 'Yüklemek için telefonunuzla tarayın',
      contact_tag: 'Destek ve Geri Bildirim',
      contact_title: 'Ekibimizle iletişime geçin.',
      contact_desc: 'Sorunuz veya turnuva öneriniz mi var? Her mesajı okuyoruz.',
      contact_lbl_name: 'Adınız',
      contact_lbl_email: 'E-posta Adresiniz',
      contact_lbl_msg: 'Mesajınız',
      contact_btn: 'Mesaj Gönder',
      contact_direct: 'Veya doğrudan e-posta gönderin:',
      footer_tagline: 'Amatör futbol ve halı saha maçları için ücretsiz maç ve turnuva takip uygulaması.',
      footer_col_app: 'Uygulama ve Çözümler',
      footer_link_tm: 'Turnuva Fikstür Oluşturucu',
      footer_link_obs: 'OBS Canlı Skor Tabelası',
      footer_link_turf: '5v5 ve 7v7 Halı Saha Skorlayıcı',
      footer_col_legal: 'İçerik ve Yasal',
      footer_link_privacy: 'Gizlilik Politikası',
      footer_link_terms: 'Kullanım Koşulları',
      footer_col_connect: 'Bağlantıda Kalın',
      footer_social_desc: 'Güncellemeler için Turfy’yi sosyal medyada takip edin.',
      footer_motto: 'Maçları skorla. Turnuva yönet. İstatistikleri tut.',
      sticky_sub: 'Ücretsiz · Reklamsız · Çevrimdışı',
      waitlist_tag: 'Çok Yakında',
      waitlist_title: 'iPhone için Turfy',
      waitlist_desc: 'E-posta adresinizi girin, iOS sürümü App Store’da yayınlandığı an size haber verelim.',
      waitlist_btn: 'Çıktığında Haber Ver'
    },
    ar: {
      nav_features: 'المميزات',
      nav_roles: 'لمن هذا التطبيق',
      nav_how: 'كيف يعمل',
      nav_faq: 'الأسئلة الشائعة',
      nav_news: 'الأخبار',
      nav_contact: 'تواصل معنا',
      btn_download_free: 'تحميل مجاني',
      btn_get_google_play: 'احصل على Turfy من Google Play',
      hero_tag: 'تطبيق مجاني لتسجيل المباريات والبطولات',
      hero_title: 'سجّل نتائج المباريات.<br>نظّم البطولات.<br><span class="lime">تتبّع كل إحصائية.</span>',
      hero_desc: 'مصمم لمباريات <strong>الخماسي (5v5)، السباعي (7v7)، الصالات (Futsal)، الأكاديميات ودوريات 11 ضد 11</strong>. أنشئ جداول مجموعات وإقصائيات من 3 إلى 32 فريقاً بدون إنترنت.',
      pill_1: 'بطولات من 3 إلى 32 فريقاً',
      pill_2: 'يعمل 100% بدون إنترنت',
      pill_3: 'لوحة نتائج مباشرة لـ OBS',
      pill_4: '5v5 · 7v7 · صالات · 11v11',
      btn_play_sub: 'متوفر على',
      ios_waitlist_cta: 'نسخة الآيفون قريباً · <strong>أعلمني عند الإطلاق</strong>',
      rating_text: '<strong>5.0</strong> على Google Play · مجاني 100% · بدون إعلانات',
      check_free: 'مجاني للأبد',
      check_noads: 'بدون إعلانات',
      check_offline: 'يعمل بدون إنترنت',
      trust_1_title: 'تسجيل مباشر بضغطة واحدة',
      trust_1_sub: 'الأهداف والبطاقات والتبديلات فوراً',
      trust_2_title: 'بطولات وجداول تلقائية',
      trust_2_sub: 'دوري، مجموعات وخروج المغلوب',
      trust_3_title: 'إحصائيات وتقارير PDF',
      trust_3_sub: 'بطاقات اللاعبين وملخصات المباريات',
      trust_4_title: 'يعمل 100% بدون إنترنت',
      trust_4_sub: 'مثالي للملاعب التي لا توجد بها تغطية',
      features_tag: 'المميزات الأساسية',
      features_title: 'كل ما تحتاجه في يوم المباراة.',
      features_desc: 'مصمم لاستبدال فوضى المحادثات والدفاتر الورقية والجداول اليدوية بضغطة واحدة.',
      f1_tag: 'الميزة #1',
      f1_title: 'تسجيل نتائج المباريات مباشرة',
      f1_desc: 'اضغط مرة واحدة لتسجيل هدف أو تمريرة حاسمة أو بطاقة أو تبديل مع مؤقت المباراة والأشواط الإضافية.',
      f1_b1: '<strong>أزرار فورية:</strong> هدف، تبديل، بطاقة، إيقاف مؤقت وتراجع سريع.',
      f1_b2: '<strong>ربط اللاعبين:</strong> حدّد مسجل الهدف وصانع الهدف بضغطة واحدة.',
      f1_b3: '<strong>أشواط المباراة:</strong> تتبع تلقائي للشوط الأول والثاني والأشواط الإضافية.',
      f1_btn: 'جرّب التسجيل المباشر مجاناً ←',
      f2_tag: 'الميزة #2',
      f2_title: 'إدارة البطولات تلقائياً',
      f2_desc: 'أنشئ بطولتك في دقائق. يتم إنشاء جدول المباريات وحساب النقاط وفارق الأهداف والترتيب تلقائياً.',
      f2_b1: '<strong>أنظمة متعددة:</strong> دوري، خروج المغلوب، ومجموعات + أدوار إقصائية (3 إلى 32 فريقاً).',
      f2_b2: '<strong>ترتيب مباشر:</strong> حساب تلقائي للنقاط والفوز والخسارة وفارق الأهداف.',
      f2_b3: '<strong>الأدوار الإقصائية:</strong> تتأهل الفرق الفائزة تلقائياً في شجرة البطولة.',
      f2_btn: 'أنشئ بطولة الآن ←',
      f3_tag: 'الميزة #3',
      f3_title: 'إحصائيات اللاعبين وتقارير PDF',
      f3_desc: 'يتم حفظ كل هدف وصناعة وبطاقة في ملف اللاعب الشخصي مع إمكانية تصدير تقارير PDF بضغطة واحدة.',
      f3_b1: '<strong>إحصائيات المسيرة:</strong> الأهداف، التمريرات الحاسمة، الشباك النظيفة والبطاقات.',
      f3_b2: '<strong>تقرير PDF فوري:</strong> شارك تقارير المباريات والبطولات جاهزة للطباعة.',
      f3_b3: '<strong>قائمة الهدافين:</strong> تتبع تلقائي لهداف البطولة وأفضل صانع ألعاب.',
      f3_btn: 'تتبّع إحصائياتك ←',
      roles_tag: 'تجربة مخصصة',
      roles_title: 'مصمم لكل شخص في الملعب.',
      roles_desc: 'اختر دورك لترى كيف يسهّل Turfy يوم مباراتك.',
      role_tab_player: 'اللاعبون',
      role_tab_captain: 'قادة الفرق',
      role_tab_organizer: 'منظمو البطولات',
      rp_title: 'تتبّع مسيرتك الكروية الشخصية',
      rp_desc: 'لا مزيد من الجدل حول من سجّل أو صنع أكثر. إحصائياتك تُحفظ لحظياً في ملفك الشخصي وجاهزة للمشاركة.',
      rp_b1: 'رصيد شخصي للأهداف والتمريرات الحاسمة والبطاقات',
      rp_b2: 'انضم إلى عدة فرق باستخدام رمز الدعوة',
      rp_b3: 'بطاقات ملخص المباراة مهيأة للواتساب وإنستغرام',
      rp_btn: 'حمّل Turfy للاعبين',
      rc_title: 'أدِر فريقك بدون جداول معقدة',
      rc_desc: 'حدّد التشكيلة الأساسية، سجّل التبديلات أثناء المباراة، واحتفظ بسجل رسمي لكل مباريات فريقك.',
      rc_b1: 'قائمة الفريق الكاملة بالصور وأرقام القمصان',
      rc_b2: 'تشكيلة ما قبل المباراة وتسجيل التبديلات مباشرة',
      rc_b3: 'بطاقات نتائج فورية لمشاركتها في مجموعة الفريق',
      rc_btn: 'حمّل Turfy لقادة الفرق',
      ro_title: 'نظّم بطولات محلية احترافية',
      ro_desc: 'تخلص من الحسابات اليدوية. أنشئ الجداول وحدّث ترتيب المجموعات تلقائياً وابث المباريات مع لوحة نتائج OBS.',
      ro_b1: 'إنشاء تلقائي لجداول الدوري والمجموعات وخروج المغلوب',
      ro_b2: 'ربط مباشر مع لوحة نتائج البث في OBS Studio و Streamlabs',
      ro_b3: 'تقارير PDF رسمية للبطولة للرعاة والفرق',
      ro_btn: 'حمّل Turfy للمنظمين',
      extras_tag: 'أدوات متقدمة',
      extras_title: 'المزيد من الأدوات داخل Turfy.',
      extras_desc: 'أدوات مصممة خصيصاً للملاعب الخماسية والسباعية والأكاديميات.',
      ex1_title: 'لوحة نتائج مباشرة لـ OBS Studio',
      ex1_desc: 'تبث النهائي مباشرة؟ انسخ رابط البث من هاتفك وألصقه في OBS أو Streamlabs لتحصل على لوحة نتائج تلفزيونية حية.',
      ex2_title: 'أخبار كرة القدم داخل التطبيق',
      ex2_desc: 'ابقَ على اطلاع بين الجولات مع أحدث أخبار وتقارير كرة القدم مباشرة داخل التطبيق.',
      ex3_title: 'بطاقات نتائج للمشاركة',
      ex3_desc: 'انتهت مباراة مثيرة؟ يحوّل Turfy النتيجة النهائية والمسجلين والشعارات إلى بطاقة جاهزة للواتساب وإنستغرام.',
      steps_tag: 'إعداد سريع',
      steps_title: 'جاهز في 3 خطوات بسيطة.',
      steps_desc: 'بدون تعقيد — يمكنك تسجيل أول مباراة لك خلال 60 ثانية.',
      step_1_title: 'أنشئ مباراتك',
      step_1_desc: 'اختر الفريقين وحدد وقت الشوط والتشكيلة وابدأ فوراً.',
      step_2_title: 'سجّل الأحداث مباشرة',
      step_2_desc: 'سجّل الأهداف والبطاقات والتبديلات لحظة حدوثها في الملعب.',
      step_3_title: 'شارك وصدّر PDF',
      step_3_desc: 'أنشئ بطاقة ملخص المباراة لواتساب أو صدّر تقرير PDF كامل.',
      faq_tag: 'لديك أسئلة؟',
      faq_title: 'الأسئلة الشائعة',
      faq_desc: 'إجابات واضحة لأكثر ما يسأله اللاعبون والمنظمون.',
      faq_q1: 'هل تطبيق Turfy مجاني 100% فعلاً؟',
      faq_a1: 'نعم، مجاني بالكامل. لا توجد اشتراكات ولا مشتريات داخل التطبيق وبدون أي إعلانات. جميع الميزات مجانية للأبد.',
      faq_q2: 'هل يعمل Turfy بدون إنترنت (أوفلاين)؟',
      faq_a2: 'نعم. يمكنك تسجيل المباريات وإدارة البطولات في الملاعب بدون تغطية، ويتم الحفظ في الهاتف والمزامنة تلقائياً عند توفر الإنترنت.',
      faq_q3: 'ما هي أنظمة البطولات المدعومة؟',
      faq_a3: 'يدعم نظام الدوري، خروج المغلوب، ونظام المجموعات + الأدوار الإقصائية (من 3 إلى 32 فريقاً) مع تحديث الترتيب تلقائياً.',
      faq_q4: 'هل توجد نسخة للآيفون (iOS)؟',
      faq_a4: 'التطبيق متوفر حالياً لأجهزة أندرويد، ونسخة الآيفون قيد التطوير — يمكنك التسجيل في قائمة الانتظار في هذه الصفحة.',
      faq_q5: 'كيف تعمل لوحة نتائج البث المباشر في OBS؟',
      faq_a5: 'انسخ رابط البث من داخل التطبيق وأضفه في OBS Studio أو Streamlabs كمصدر متصفح (Browser Source) لتتحدث النتيجة والوقت مباشرة.',
      faq_q6: 'هل يمكنني تصدير تقارير المباريات والإحصائيات بصيغة PDF؟',
      faq_a6: 'نعم، بضغطة واحدة يمكنك تصدير تقرير PDF احترافي جاهز للطباعة أو المشاركة عبر واتساب.',
      faq_q7: 'هل يناسب مباريات الخماسي (5v5) والسباعي (7v7) والصالات و11 ضد 11؟',
      faq_a7: 'نعم، يدعم جميع أحجام الفرق وأوقات الأشواط المخصصة والتبديلات المفتوحة.',
      faq_q8: 'كيف يتابع اللاعبون والجمهور النتائج وجداول الترتيب؟',
      faq_a8: 'تتحدث النتائج وجداول المجموعات وشجرة البطولة وقائمة الهدافين تلقائياً فور تسجيل كل حدث.',
      faq_q9: 'كيف يدير التطبيق بطولة من 28 فريقاً (أو 3 إلى 32 فريقاً)؟',
      faq_a9: 'مع 28 فريقاً، ينشئ التطبيق 7 مجموعات من 4 فرق (42 مباراة). يتأهل أول وثاني كل مجموعة (14 فريقاً) بالإضافة إلى أفضل فريقين في المركز الثالث (حسب النقاط ثم فارق الأهداف ثم الأهداف المسجلة) لإكمال دور الـ 16 تلقائياً.',
      faq_q10: 'ما هو أفضل تطبيق مجاني لتنظيم بطولات كرة القدم؟',
      faq_a10: 'يجمع Turfy بين التسجيل المباشر، الجداول التلقائية حتى 32 فريقاً، إحصائيات اللاعبين، تقارير PDF ولوحة OBS مجاناً وبدون إعلانات.',
      faq_q11: 'ما الفرق بين Turfy والجداول اليدوية أو التطبيقات المدفوعة؟',
      faq_a11: 'على عكس التطبيقات التي تطلب اشتراكاً لفتح الأدوار الإقصائية أو تقارير PDF، يقدم Turfy كل الميزات مجاناً وبدون إنترنت.',
      cta_title: 'مباراتك القادمة <span class="lime">تبدأ من هنا.</span>',
      cta_desc: 'مجاني للأبد. بدون إعلانات. يعمل بدون إنترنت.',
      cta_btn_play: 'حمّل Turfy مجاناً من Google Play',
      cta_btn_ios: 'قائمة انتظار الآيفون',
      qr_label: 'امسح الرمز بهاتفك للتثبيت',
      contact_tag: 'الدعم والملاحظات',
      contact_title: 'تواصل مع فريقنا.',
      contact_desc: 'هل لديك سؤال أو اقتراح لبطولتك؟ نحن نقرأ كل رسالة.',
      contact_lbl_name: 'الاسم',
      contact_lbl_email: 'البريد الإلكتروني',
      contact_lbl_msg: 'الرسالة',
      contact_btn: 'إرسال الرسالة',
      contact_direct: 'أو راسلنا مباشرة عبر البريد:',
      footer_tagline: 'التطبيق المجاني لتسجيل نتائج المباريات والبطولات لكرة القدم حول العالم.',
      footer_col_app: 'التطبيق والحلول',
      footer_link_tm: 'منظم جداول البطولات',
      footer_link_obs: 'لوحة نتائج البث OBS',
      footer_link_turf: 'مسجل مباريات 5v5 و 7v7',
      footer_col_legal: 'المحتوى والقانونية',
      footer_link_privacy: 'سياسة الخصوصية',
      footer_link_terms: 'الشروط والأحكام',
      footer_col_connect: 'تواصل معنا',
      footer_social_desc: 'تابع Turfy على شبكات التواصل الاجتماعي.',
      footer_motto: 'سجّل المباريات. نظّم البطولات. تتبّع إحصائياتك.',
      sticky_sub: 'مجاني · بدون إعلانات · بدون نت',
      waitlist_tag: 'قريباً',
      waitlist_title: 'Turfy للآيفون',
      waitlist_desc: 'أدخل بريدك الإلكتروني وسنخبرك فور إطلاق نسخة iOS على متجر آبل.',
      waitlist_btn: 'أعلمني عند الإطلاق'
    },
    id: {
      nav_features: 'Fitur',
      nav_roles: 'Untuk Siapa',
      nav_how: 'Cara Kerja',
      nav_faq: 'FAQ',
      nav_news: 'Berita',
      nav_contact: 'Kontak',
      btn_download_free: 'Unduh Gratis',
      btn_get_google_play: 'Unduh Turfy di Google Play',
      hero_tag: 'Aplikasi Skor & Turnamen Bola Gratis',
      hero_title: 'Catat skor langsung.<br>Kelola turnamen.<br><span class="lime">Lacak setiap statistik.</span>',
      hero_desc: 'Dibuat untuk <strong>Mini Soccer (7v7), Futsal (5v5), akademi, dan liga 11v11</strong>. Buat bagan turnamen 3–32 tim otomatis, live streaming dengan papan skor OBS, dan gunakan tanpa kuota internet.',
      pill_1: 'Turnamen 3–32 Tim',
      pill_2: '100% Mode Offline',
      pill_3: 'Overlay Skor OBS Gratis',
      pill_4: '5v5 · 7v7 Mini Soccer · Futsal · 11v11',
      btn_play_sub: 'Temukan di',
      ios_waitlist_cta: 'Segera hadir di iPhone · <strong>Beri tahu saya</strong>',
      rating_text: '<strong>5.0</strong> di Google Play · 100% Gratis · Tanpa Iklan',
      check_free: 'Gratis selamanya',
      check_noads: 'Tanpa iklan',
      check_offline: 'Bisa offline',
      trust_1_title: 'Catat Skor Sekali Sentuh',
      trust_1_sub: 'Gol, kartu & pergantian pemain real-time',
      trust_2_title: 'Turnamen Otomatis',
      trust_2_sub: 'Klasemen liga, fase grup & gugur',
      trust_3_title: 'Statistik & Laporan PDF',
      trust_3_sub: 'Kartu pemain & hasil siap bagikan',
      trust_4_title: '100% Mode Offline',
      trust_4_sub: 'Tetap jalan di lapangan tanpa sinyal',
      features_tag: 'Fitur Utama',
      features_title: 'Semua yang Anda butuhkan saat hari pertandingan.',
      features_desc: 'Dirancang untuk menggantikan grup chat yang berantakan, catatan kertas yang hilang, dan tabel manual.',
      f1_tag: 'Fitur #1',
      f1_title: 'Pencatat Skor Pertandingan Langsung',
      f1_desc: 'Sentuh sekali untuk mencatat gol, kartu, assist, atau pergantian pemain. Timer pertandingan dan jeda babak sudah tersedia.',
      f1_b1: '<strong>Tombol instan:</strong> Gol, Sub, Kartu, Jeda, dan Batal cepat.',
      f1_b2: '<strong>Tag pemain:</strong> Tandai pencetak gol dan pemberi assist dengan satu ketukan.',
      f1_b3: '<strong>Fase laga:</strong> Babak 1, Babak 2, dan Perpanjangan Waktu otomatis.',
      f1_btn: 'Coba Skor Langsung Gratis →',
      f2_tag: 'Fitur #2',
      f2_title: 'Manajemen Turnamen Otomatis',
      f2_desc: 'Atur turnamen Anda dalam hitungan menit. Jadwal dibuat otomatis dan klasemen grup menghitung poin serta selisih gol secara langsung.',
      f2_b1: '<strong>Berbagai format:</strong> Liga, Sistem Gugur, Fase Grup + Final (3–32 tim).',
      f2_b2: '<strong>Klasemen langsung:</strong> Poin, menang, kalah, dan selisih gol otomatis.',
      f2_b3: '<strong>Bagan gugur:</strong> Bagan babak gugur terisi otomatis saat pemenang lolos.',
      f2_btn: 'Buat Turnamen →',
      f3_tag: 'Fitur #3',
      f3_title: 'Statistik Pemain & Laporan PDF',
      f3_desc: 'Setiap gol, assist, dan kartu tersimpan di profil pemain. Ekspor laporan PDF resmi hanya dengan satu ketukan.',
      f3_b1: '<strong>Statistik karier:</strong> Gol, assist, clean sheet, dan riwayat kartu.',
      f3_b2: '<strong>PDF 1-klik:</strong> Bagikan lembar pertandingan siap cetak ke pelatih atau sponsor.',
      f3_b3: '<strong>Papan top skor:</strong> Pelacakan otomatis pencetak gol terbanyak turnamen.',
      f3_btn: 'Lacak Statistik Anda →',
      roles_tag: 'Pengalaman Personal',
      roles_title: 'Dibuat untuk semua orang di lapangan.',
      roles_desc: 'Pilih peran Anda untuk melihat bagaimana Turfy memudahkan hari pertandingan Anda.',
      role_tab_player: 'Pemain',
      role_tab_captain: 'Kapten',
      role_tab_organizer: 'Panitia',
      rp_title: 'Lacak perjalanan sepak bola pribadi Anda',
      rp_desc: 'Tak perlu lagi berdebat siapa yang mencetak gol atau assist terbanyak. Statistik Anda tercatat otomatis di profil.',
      rp_b1: 'Catatan gol, assist, dan kartu pribadi',
      rp_b2: 'Gabung ke banyak tim dengan kode undangan',
      rp_b3: 'Kartu ringkasan laga siap bagikan ke WhatsApp & Instagram',
      rp_btn: 'Unduh Turfy untuk Pemain',
      rc_title: 'Kelola skuad Anda tanpa spreadsheet rumit',
      rc_desc: 'Atur susunan pemain utama, catat pergantian pemain saat laga, dan simpan rekor resmi setiap pertandingan tim.',
      rc_b1: 'Daftar skuad lengkap dengan foto dan nomor punggung',
      rc_b2: 'Susunan pemain pra-laga dan pencatatan sub real-time',
      rc_b3: 'Kartu hasil pertandingan instan untuk grup tim Anda',
      rc_btn: 'Unduh Turfy untuk Kapten',
      ro_title: 'Jalankan turnamen lokal secara profesional',
      ro_desc: 'Hilangkan hitungan manual. Buat jadwal grup & gugur otomatis, perbarui klasemen langsung, dan live streaming dengan overlay OBS.',
      ro_b1: 'Jadwal grup dan bagan gugur otomatis (3–32 tim)',
      ro_b2: 'Integrasi papan skor live OBS Studio & Streamlabs',
      ro_b3: 'Laporan turnamen PDF resmi untuk sponsor dan tim',
      ro_btn: 'Unduh Turfy untuk Panitia',
      extras_tag: 'Fitur Unggulan',
      extras_title: 'Fitur lengkap lainnya di dalam Turfy.',
      extras_desc: 'Alat tambahan khusus untuk futsal, mini soccer, dan sepak bola komunitas.',
      ex1_title: 'Overlay Papan Skor Live OBS',
      ex1_desc: 'Streaming laga final? Tempel tautan dari ponsel Anda ke OBS atau Streamlabs sebagai Browser Source untuk menampilkan papan skor TV langsung.',
      ex2_title: 'Berita Sepak Bola di Aplikasi',
      ex2_desc: 'Tetap update di sela jadwal laga dengan berita sepak bola terbaru langsung di dalam aplikasi.',
      ex3_title: 'Kartu Skor Media Sosial',
      ex3_desc: 'Pertandingan seru baru selesai? Bagikan kartu skor lengkap dengan pencetak gol dan logo tim ke WhatsApp atau Instagram.',
      steps_tag: 'Persiapan Cepat',
      steps_title: 'Siap dalam 3 langkah mudah.',
      steps_desc: 'Anda dapat mencatat pertandingan pertama Anda dalam 60 detik.',
      step_1_title: 'Buat Pertandingan',
      step_1_desc: 'Pilih dua tim, atur durasi babak, dan mulai langsung.',
      step_2_title: 'Catat Skor Langsung',
      step_2_desc: 'Ketuk untuk mencatat gol, kartu, dan pergantian pemain di pinggir lapangan.',
      step_3_title: 'Bagikan & Ekspor PDF',
      step_3_desc: 'Buat kartu hasil pertandingan untuk WhatsApp atau ekspor laporan PDF lengkap.',
      faq_tag: 'Ada Pertanyaan?',
      faq_title: 'Pertanyaan yang Sering Diajukan',
      faq_desc: 'Jawaban jelas untuk hal yang paling sering ditanyakan pemain dan panitia.',
      faq_q1: 'Apakah Turfy benar-benar 100% gratis?',
      faq_a1: 'Ya, sepenuhnya gratis. Tanpa langganan, tanpa pembelian dalam aplikasi, dan nol iklan selamanya.',
      faq_q2: 'Apakah Turfy bisa digunakan offline tanpa internet?',
      faq_a2: 'Ya. Anda bisa mencatat skor dan mengelola turnamen di lapangan tanpa sinyal. Data tersimpan di ponsel dan sinkron otomatis saat kembali online.',
      faq_q3: 'Format turnamen apa saja yang didukung?',
      faq_a3: 'Liga (Round Robin), Sistem Gugur (Knockout), dan Fase Grup + Gugur (3 hingga 32 tim) dengan klasemen otomatis.',
      faq_q4: 'Apakah ada versi iPhone / iOS?',
      faq_a4: 'Saat ini tersedia untuk Android (5.0+). Versi iOS sedang dikembangkan — bergabunglah di daftar tunggu pada halaman ini.',
      faq_q5: 'Bagaimana cara kerja papan skor live OBS Studio?',
      faq_a5: 'Buat tautan siaran di aplikasi lalu tempel ke OBS Studio atau Streamlabs sebagai Browser Source. Skor akan berubah secara live di siaran Anda.',
      faq_q6: 'Bisakah saya mengekspor laporan pertandingan dan statistik ke PDF?',
      faq_a6: 'Ya, ekspor lembar pertandingan dan statistik turnamen ke PDF hanya dengan satu ketukan untuk dibagikan ke WhatsApp.',
      faq_q7: 'Bisakah digunakan untuk Futsal (5v5), Mini Soccer (7v7), dan 11v11?',
      faq_a7: 'Ya, mendukung 5v5, 6v6, 7v7, 8v8, 9v9, Futsal, dan 11v11 dengan durasi babak dan jumlah pemain yang dapat disesuaikan.',
      faq_q8: 'Bagaimana pemain dan suporter memantau skor dan klasemen?',
      faq_a8: 'Skor langsung, tabel grup, bagan gugur, dan daftar top skor diperbarui secara otomatis setiap kali gol dicatat.',
      faq_q9: 'Bagaimana cara kerja turnamen 28 tim (atau 3–32 tim) Fase Grup + Gugur?',
      faq_a9: 'Untuk 28 tim, Turfy otomatis membuat 7 grup berisi 4 tim (42 laga grup). Top 2 tiap grup (14 tim) + 2 peringkat ke-3 terbaik (berdasarkan Poin, Selisih Gol, dan Produktivitas Gol) lolos ke Babak 16 Besar.',
      faq_q10: 'Apa aplikasi gratis terbaik untuk membuat turnamen sepak bola atau futsal?',
      faq_a10: 'Turfy menggabungkan pencatat skor langsung, bagan otomatis 3–32 tim, statistik pemain, laporan PDF, dan overlay OBS tanpa iklan dan tanpa biaya.',
      faq_q11: 'Apa keunggulan Turfy dibanding Excel atau aplikasi turnamen berbayar?',
      faq_a11: 'Tidak seperti Excel manual atau aplikasi yang mengunci babak gugur di balik langganan berbayar, Turfy 100% gratis hingga 32 tim dan bekerja secara offline.',
      cta_title: 'Hari pertandingan Anda berikutnya <span class="lime">dimulai di sini.</span>',
      cta_desc: 'Gratis selamanya. Tanpa iklan. Bisa offline.',
      cta_btn_play: 'Unduh Turfy Gratis di Google Play',
      cta_btn_ios: 'Daftar Tunggu iPhone',
      qr_label: 'Pindai dengan ponsel untuk menginstal',
      contact_tag: 'Dukungan & Masukan',
      contact_title: 'Hubungi tim kami.',
      contact_desc: 'Punya pertanyaan atau saran fitur turnamen? Kami membaca setiap pesan.',
      contact_lbl_name: 'Nama Anda',
      contact_lbl_email: 'Alamat Email',
      contact_lbl_msg: 'Pesan',
      contact_btn: 'Kirim Pesan',
      contact_direct: 'Atau kirim email langsung ke',
      footer_tagline: 'Aplikasi pencatat pertandingan dan turnamen sepak bola gratis untuk komunitas di seluruh dunia.',
      footer_col_app: 'Aplikasi & Solusi',
      footer_link_tm: 'Pembuat Bagan Turnamen',
      footer_link_obs: 'Overlay Papan Skor OBS',
      footer_link_turf: 'Skor Mini Soccer 7v7 & Futsal 5v5',
      footer_col_legal: 'Konten & Legal',
      footer_link_privacy: 'Kebijakan Privasi',
      footer_link_terms: 'Syarat & Ketentuan',
      footer_col_connect: 'Terhubung',
      footer_social_desc: 'Ikuti Turfy di media sosial untuk info terbaru.',
      footer_motto: 'Catat skor. Kelola turnamen. Lacak statistik Anda.',
      sticky_sub: 'Gratis · Tanpa iklan · Offline',
      waitlist_tag: 'Segera Hadir',
      waitlist_title: 'Turfy untuk iPhone',
      waitlist_desc: 'Masukkan email Anda dan kami akan memberi tahu Anda saat versi iOS rilis di App Store.',
      waitlist_btn: 'Beri Tahu Saat Rilis'
    }
  };

  function detectAndApplyRegionLanguage() {
    try {
      // Allow instant testing via ?lang=pt, ?lang=es, ?lang=ar, ?lang=fr, ?lang=de, ?lang=tr, ?lang=id, ?lang=en
      const urlLang = new URLSearchParams(window.location.search).get('lang');
      let matchedLang = null;

      if (urlLang) {
        const cleanUrlLang = urlLang.toLowerCase().split('-')[0];
        if (cleanUrlLang === 'en') {
          document.documentElement.setAttribute('lang', 'en');
          document.documentElement.setAttribute('dir', 'ltr');
          return;
        }
        if (translations[cleanUrlLang]) {
          matchedLang = cleanUrlLang;
        } else if (cleanUrlLang === 'ms') {
          matchedLang = 'id';
        }
      } else {
        const rawLangs = (navigator.languages && navigator.languages.length)
          ? navigator.languages
          : [navigator.language || 'en'];

        for (const l of rawLangs) {
          const code = String(l).toLowerCase().split('-')[0];
          if (code === 'en') break; // User prefers English first
          if (translations[code]) {
            matchedLang = code;
            break;
          }
          if (code === 'ms') {
            matchedLang = 'id';
            break;
          }
        }
      }

      if (!matchedLang) return;

      const dict = translations[matchedLang];
      document.documentElement.setAttribute('lang', matchedLang);
      document.documentElement.setAttribute('dir', matchedLang === 'ar' ? 'rtl' : 'ltr');

      document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
          el.textContent = dict[key];
        }
      });

      document.querySelectorAll('[data-i18n-html]').forEach((el) => {
        const key = el.getAttribute('data-i18n-html');
        if (dict[key]) {
          el.innerHTML = dict[key];
        }
      });
    } catch (_) {}
  }

  detectAndApplyRegionLanguage();

  // 10. Interactive 3-32 Team Tournament Format Calculator (Used on /tournament-maker.html)
  const calcSlider = document.getElementById('calc-team-slider');
  const calcTeamNum = document.getElementById('calc-team-num');
  const calcFormatVal = document.getElementById('calc-format-val');
  const calcFormatSub = document.getElementById('calc-format-sub');
  const calcGroupVal = document.getElementById('calc-group-val');
  const calcGroupSub = document.getElementById('calc-group-sub');
  const calcKnockoutVal = document.getElementById('calc-knockout-val');
  const calcKnockoutSub = document.getElementById('calc-knockout-sub');
  const calcTotalVal = document.getElementById('calc-total-val');
  const calcTotalSub = document.getElementById('calc-total-sub');
  const calcRuleTitle = document.getElementById('calc-rule-title');
  const calcRuleDesc = document.getElementById('calc-rule-desc');
  const presetBtns = document.querySelectorAll('.calc-preset-btn');

  function computeTournamentStructure(teamCount) {
    const lang = (document.documentElement.getAttribute('lang') || 'en').slice(0, 2);
    if (teamCount <= 5) {
      const groupMatches = (teamCount * (teamCount - 1)) / 2;
      if (lang === 'pt') {
        return {
          formatVal: 'Pontos Corridos + Final',
          formatSub: '1 Tabela • Final Automática',
          groupVal: `${groupMatches} Jogos`,
          groupSub: `Grupo único de ${teamCount} times`,
          knockoutVal: '1 Jogo (Final)',
          knockoutSub: 'Os 2 melhores jogam a Final',
          totalVal: `${groupMatches + 1} Jogos`,
          totalSub: `${groupMatches} grupo + 1 final`,
          ruleTitle: `Como funciona a classificação com ${teamCount} times:`,
          ruleDesc: `Todos os ${teamCount} times jogam entre si em turno único (${groupMatches} jogos). O 1º e o 2º colocados por Pontos, Saldo de Gols e Gols Pró avançam direto para a Grande Final.`
        };
      }
      if (lang === 'es') {
        return {
          formatVal: 'Todos contra Todos + Final',
          formatSub: '1 Tabla • Final Automática',
          groupVal: `${groupMatches} Partidos`,
          groupSub: `Grupo único de ${teamCount} equipos`,
          knockoutVal: '1 Partido (Final)',
          knockoutSub: 'Los 2 mejores juegan la Final',
          totalVal: `${groupMatches + 1} Partidos`,
          totalSub: `${groupMatches} grupo + 1 final`,
          ruleTitle: `Cómo funciona la clasificación con ${teamCount} equipos:`,
          ruleDesc: `Los ${teamCount} equipos juegan todos contra todos en una tabla única (${groupMatches} partidos). El 1º y 2º lugar por Puntos, Diferencia de Goles y Goles a Favor avanzan directo a la Gran Final.`
        };
      }
      return {
        formatVal: 'Round Robin + Final',
        formatSub: '1 League Table • Auto Final',
        groupVal: `${groupMatches} Matches`,
        groupSub: `Single group of ${teamCount} teams`,
        knockoutVal: '1 Match (Final)',
        knockoutSub: 'Top 2 teams play the Final',
        totalVal: `${groupMatches + 1} Matches`,
        totalSub: `${groupMatches} group + 1 final`,
        ruleTitle: `How ${teamCount}-Team Qualification Works:`,
        ruleDesc: `All ${teamCount} teams play each other once in a single league table (${groupMatches} matches). The 1st and 2nd place teams on Points, Goal Difference (GD), and Goals Scored (GF) advance directly to the Grand Final.`
      };
    }

    const groupCount = (teamCount >= 17 && teamCount <= 20) ? 4 : Math.ceil(teamCount / 4);
    const baseSize = Math.floor(teamCount / groupCount);
    const rem = teamCount % groupCount;
    let groupMatches = 0;
    for (let g = 0; g < groupCount; g++) {
      const sz = g < rem ? baseSize + 1 : baseSize;
      groupMatches += (sz * (sz - 1)) / 2;
    }

    let koTeams, koMatches, koPath;
    if (teamCount <= 8) {
      koTeams = 4;
      koMatches = 3;
      koPath = lang === 'pt' ? 'Semifinais (2) → Final (1)' : lang === 'es' ? 'Semifinales (2) → Final (1)' : 'Semifinals (2) → Final (1)';
    } else if (teamCount <= 20) {
      koTeams = 8;
      koMatches = 7;
      koPath = lang === 'pt' ? 'Quartas (4) → Semi (2) → Final (1)' : lang === 'es' ? 'Cuartos (4) → Semi (2) → Final (1)' : 'QF (4) → SF (2) → Final (1)';
    } else {
      koTeams = 16;
      koMatches = 15;
      koPath = lang === 'pt' ? 'Oitavas (8) → Quartas (4) → Semi (2) → Final (1)' : lang === 'es' ? 'Octavos (8) → Cuartos (4) → Semi (2) → Final (1)' : 'R16 (8) → QF (4) → SF (2) → Final (1)';
    }

    const directTeams = groupCount * 2;
    const wildcardCount = koTeams - directTeams;

    if (lang === 'pt') {
      const sizeDesc = rem === 0
        ? `${groupCount} grupos de ${baseSize} times`
        : `${rem} grupo(s) de ${baseSize + 1} e ${groupCount - rem} grupo(s) de ${baseSize}`;
      const qualDesc = wildcardCount > 0
        ? `Os 2 melhores de cada um dos ${groupCount} grupos avançam direto (${directTeams} times). Entre os restantes, o Turfy compara todos os 3º colocados por Pontos, Saldo de Gols e Gols Pró e classifica os ${wildcardCount} melhores 3º colocados (${directTeams} + ${wildcardCount} = ${koTeams} no mata-mata).`
        : `Os 2 melhores de cada um dos ${groupCount} grupos avançam direto (${groupCount} × 2 = ${koTeams} times) para a chave de mata-mata (${koPath}).`;
      return {
        formatVal: `${groupCount} Grupos + Mata-Mata`,
        formatSub: `Mata-mata de ${koTeams} times`,
        groupVal: `${groupMatches} Jogos`,
        groupSub: sizeDesc,
        knockoutVal: `${koMatches} Jogos`,
        knockoutSub: koPath,
        totalVal: `${groupMatches + koMatches} Jogos`,
        totalSub: `${groupMatches} grupos + ${koMatches} mata-mata`,
        ruleTitle: `Classificação para ${teamCount} Times (${groupCount} Grupos → Mata-Mata de ${koTeams}):`,
        ruleDesc: qualDesc
      };
    }

    if (lang === 'es') {
      const sizeDesc = rem === 0
        ? `${groupCount} grupos de ${baseSize} equipos`
        : `${rem} grupo(s) de ${baseSize + 1} y ${groupCount - rem} grupo(s) de ${baseSize}`;
      const qualDesc = wildcardCount > 0
        ? `Los 2 mejores de cada uno de los ${groupCount} grupos clasifican directo (${directTeams} equipos). Entre los demás, Turfy compara a los 3º lugares por Puntos, Diferencia de Goles y Goles a Favor y clasifica a los ${wildcardCount} mejores terceros (${directTeams} + ${wildcardCount} = ${koTeams} en eliminatorias).`
        : `Los 2 mejores de cada uno de los ${groupCount} grupos clasifican directo (${groupCount} × 2 = ${koTeams} equipos) al cuadro eliminatorio (${koPath}).`;
      return {
        formatVal: `${groupCount} Grupos + Eliminatorias`,
        formatSub: `Eliminatoria de ${koTeams} equipos`,
        groupVal: `${groupMatches} Partidos`,
        groupSub: sizeDesc,
        knockoutVal: `${koMatches} Partidos`,
        knockoutSub: koPath,
        totalVal: `${groupMatches + koMatches} Partidos`,
        totalSub: `${groupMatches} grupos + ${koMatches} eliminatorias`,
        ruleTitle: `Clasificación para ${teamCount} Equipos (${groupCount} Grupos → Eliminatoria de ${koTeams}):`,
        ruleDesc: qualDesc
      };
    }

    const sizeDesc = rem === 0
      ? `${groupCount} groups of ${baseSize} teams`
      : `${rem} group(s) of ${baseSize + 1} & ${groupCount - rem} group(s) of ${baseSize}`;
    const qualDesc = wildcardCount > 0
      ? `Top 2 from each of the ${groupCount} groups qualify directly (${directTeams} teams). From the remaining teams, Turfy compares all 3rd-place teams by Points, Goal Difference (GD), and Goals Scored (GF) and picks the Top ${wildcardCount} best 3rd-place teams (${directTeams} + ${wildcardCount} = ${koTeams} knockout teams).`
      : `Top 2 from each of the ${groupCount} groups qualify directly (${groupCount} × 2 = ${koTeams} teams) and are seeded into the ${koTeams}-team knockout bracket (${koPath}).`;

    return {
      formatVal: `${groupCount} Groups + Knockout`,
      formatSub: `${koTeams}-team knockout bracket`,
      groupVal: `${groupMatches} Matches`,
      groupSub: sizeDesc,
      knockoutVal: `${koMatches} Matches`,
      knockoutSub: koPath,
      totalVal: `${groupMatches + koMatches} Matches`,
      totalSub: `${groupMatches} group + ${koMatches} knockout`,
      ruleTitle: `How ${teamCount}-Team Qualification Works (${groupCount} Groups → ${koTeams}-Team Knockout):`,
      ruleDesc: qualDesc
    };
  }

  function updateCalculator(val) {
    const n = parseInt(val, 10) || 28;
    if (calcTeamNum) calcTeamNum.textContent = n;
    if (calcSlider && parseInt(calcSlider.value, 10) !== n) {
      calcSlider.value = n;
    }
    presetBtns.forEach((btn) => {
      if (parseInt(btn.getAttribute('data-teams'), 10) === n) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const info = computeTournamentStructure(n);
    if (calcFormatVal) calcFormatVal.textContent = info.formatVal;
    if (calcFormatSub) calcFormatSub.textContent = info.formatSub;
    if (calcGroupVal) calcGroupVal.textContent = info.groupVal;
    if (calcGroupSub) calcGroupSub.textContent = info.groupSub;
    if (calcKnockoutVal) calcKnockoutVal.textContent = info.knockoutVal;
    if (calcKnockoutSub) calcKnockoutSub.textContent = info.knockoutSub;
    if (calcTotalVal) calcTotalVal.textContent = info.totalVal;
    if (calcTotalSub) calcTotalSub.textContent = info.totalSub;
    if (calcRuleTitle) calcRuleTitle.textContent = info.ruleTitle;
    if (calcRuleDesc) calcRuleDesc.textContent = info.ruleDesc;
  }

  if (calcSlider) {
    calcSlider.addEventListener('input', (e) => updateCalculator(e.target.value));
    presetBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        updateCalculator(btn.getAttribute('data-teams'));
      });
    });
    updateCalculator(calcSlider.value || 28);
  }
})();
