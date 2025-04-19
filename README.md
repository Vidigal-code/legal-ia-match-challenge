# Match Inteligente - LEGAL.AI

## Sobre o Projeto

Match Inteligente é um MVP (Minimum Viable Product) que simula um sistema de matchmaking com inteligência artificial. A aplicação conecta profissionais com base em afinidades de área de atuação e localização geográfica.

![Match Inteligente Logo](public/assets/operadoralegal_logo.jpg)

## Funcionalidades

- Formulário de cadastro com nome, área de interesse e localização
- Algoritmo de IA simulada para calcular afinidade entre pessoas
- Exibição dos melhores matches com porcentagem de afinidade
- Interface responsiva e amigável
- Navegação entre páginas (landing page, formulário de match e página 404)

## Tecnologias Utilizadas

- React
- TypeScript
- React Router para navegação
- Axios para requisições HTTP
- Tailwind CSS para estilização
- Vite como bundler

## Estrutura do Projeto

```
src/
├── api/
│   └── api.ts            # Funções para chamadas de API
├── components/
│   └── footer/
│       └── Footer.tsx    # Componente de rodapé reutilizável
├── pages/
│   ├── LandingPage.tsx   # Página inicial com descrição do serviço
│   ├── Match.tsx         # Página principal com formulário e resultados
│   └── RouteNotFound.tsx # Página 404 personalizada
├── types/
│   └── interface.ts      # Interfaces e tipos do TypeScript
└── main.tsx              # Ponto de entrada da aplicação
```

## Algoritmo de Matching

O algoritmo principal de matchmaking está implementado na página `Match.tsx` e funciona da seguinte forma:

1. **Coleta de dados**: Usuário preenche seu nome, área de interesse e localização
2. **Filtragem inicial**: Remove o próprio usuário da lista de possíveis matches
3. **Cálculo de afinidade**: Para cada pessoa na base de dados, calcula uma pontuação de afinidade baseada em:
    - **Área de interesse**: Até 50 pontos para correspondência exata, ou pontuação parcial baseada em similaridade
    - **Localização**: Até 30 pontos para correspondência exata, ou pontuação parcial baseada em similaridade
    - **Fator de variabilidade**: Até 20 pontos aleatórios para diversificar os resultados

4. **Comparação avançada de texto**: Utiliza diversos métodos para detectar similaridades:
    - Correspondência exata (100% dos pontos)
    - Verificação de substrings (80% dos pontos)
    - Distância de Levenshtein para calcular similaridade fuzzy
    - Sobreposição de palavras para encontrar termos comuns

5. **Ordenação e seleção**: Os matches são ordenados por pontuação de afinidade em ordem decrescente e os melhores são mostrados ao usuário

## Funções Principais

### Função de Correspondência (`findMatches`)

Esta função é responsável por processar o formulário e encontrar os melhores matches:

```typescript
const findMatches = (): void => {
    // Validação dos campos
     if (!formData.name) {
         setErrorMessage("Por favor, preencha o campo de nome.");
         return;
        }

      if (!formData.area) {
          setErrorMessage("Por favor, selecione sua área de interesse.");
           return;
        }

       if (!formData.location) {
          setErrorMessage("Por favor, informe sua localização.");
          return;
        }

    setIsLoading(true);
    setShowResults(false);
    setErrorMessage(null);

    setTimeout(() => {
        // Filtra o próprio usuário da lista
        const filteredMatches = PotentialPeopleResults.filter(person =>
            person.name.toLowerCase() !== formData.name.toLowerCase()
        );

        if (filteredMatches.length === 0) {
            setMatches([]);
            setIsLoading(false);
            setShowResults(true);
            return;
        }

        // Calcula afinidade para cada potencial match
        const matchesWithAffinity: PeoplesAffinityMatch[] = filteredMatches.map(person => ({
            ...person,
            affinity: calculateAffinityScore(person)
        }));

        // Seleciona os melhores matches
        const topMatches = matchesWithAffinity
            .sort((a, b) => b.affinity - a.affinity)
            .slice(0, VITE_API_MATCH_HOW_MANY_WERE_FOUND);

        setMatches(topMatches);
        setIsLoading(false);
        setShowResults(true);
    }, 1500);
};
```

### Cálculo de Afinidade (`calculateAffinityScore`)

Esta função calcula a pontuação de afinidade entre um potencial match e o usuário atual:

```typescript
const calculateAffinityScore = (person: PeoplesDataMatch): number => {
    let score = 0;
    
    // Pontuação para área (máximo 50 pontos)
    score += calculateFieldScore(
        person.area,
        formData.area,
        {exact: 50, partial: 25, threshold: 0.6}
    );
    
    // Pontuação para localização (máximo 30 pontos)
    score += calculateFieldScore(
        person.location,
        formData.location,
        {exact: 30, partial: 15, threshold: 0.5}
    );
    
    // Fator de variabilidade (até 20 pontos)
    score += Math.floor(Math.random() * 20);
    
    // Limita a pontuação máxima a 100
    return Math.min(score, 100);
};
```

### Cálculo de Pontuação por Campo (`calculateFieldScore`)

Esta função avalia a similaridade entre dois valores textuais e retorna uma pontuação:

```typescript
const calculateFieldScore = (
    value1: string,
    value2: string,
    options: { exact: number, partial: number, threshold: number }
): number => {
    const s1 = value1.toLowerCase();
    const s2 = value2.toLowerCase();
    
    // Correspondência exata
    if (s1 === s2) {
        return options.exact;
    }
    
    // Verificação de substring
    if (s1.includes(s2) || s2.includes(s1)) {
        return Math.floor(options.partial * 0.8);
    }
    
    // Cálculo de distância de Levenshtein
    const distance = levenshteinDistance(s1, s2);
    const maxLength = Math.max(s1.length, s2.length);
    
    if (maxLength === 0) return 0;
    
    const similarity = 1 - (distance / maxLength);
    
    // Aplicar similaridade se acima do limite
    if (similarity >= options.threshold) {
        return Math.floor(similarity * options.partial);
    }
    
    // Verificação de sobreposição de palavras
    const words1 = new Set(s1.split(' ').filter(w => w.length > 2));
    const words2 = new Set(s2.split(' ').filter(w => w.length > 2));
    
    let commonWords = 0;
    words1.forEach(word => {
        if (words2.has(word)) commonWords++;
    });
    
    if (commonWords > 0) {
        const totalUniqueWords = new Set([...words1, ...words2]).size;
        const wordSimilarity = totalUniqueWords > 0 ? commonWords / totalUniqueWords : 0;
        return Math.floor(wordSimilarity * options.partial);
    }
    
    return 0;
};
```

### Distância de Levenshtein

Implementação do algoritmo de distância de Levenshtein para avaliar a similaridade entre strings:

```typescript
const levenshteinDistance = (str1: string, str2: string): number => {
    const m = str1.length;
    const n = str2.length;
    
    // Criar matriz de tamanho (m+1) x (n+1)
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    // Inicializar primeira linha e coluna
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    // Preencher a matriz
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,        // deleção
                dp[i][j - 1] + 1,        // inserção
                dp[i - 1][j - 1] + cost  // substituição
            );
        }
    }
    
    return dp[m][n];
};
```

## Como Executar o Projeto

1. Clone o repositório:
```bash
git clone https://github.com/Vidigal-code/legal-ia-match-challenge.git
cd legal-ia-match-challenge
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
VITE_API_MATCH_PEOPLES_DATA=/data/peopledata.json
VITE_API_MATCH_AREAS_DATA=/data/areadata.json
VITE_API_MATCH_LOGO_URL=/assets/operadoralegal_logo.jpg
VITE_API_MATCH_HOW_MANY_WERE_FOUND=6
```

4. Execute o projeto em desenvolvimento:
```bash
npm run dev
```

5. Acesse no navegador:
```
http://localhost:5173
```

## Principais Decisões de Design

1. **Divisão em Componentes**: Separação clara entre lógica de negócio e apresentação
2. **Algoritmo de Similaridade Avançado**: Implementação de múltiplas técnicas para comparação textual
3. **Visual Clean e Profissional**: Interface focada na experiência do usuário
4. **Responsividade**: Layout adaptável para dispositivos móveis e desktop
5. **Feedback Visual**: Indicadores claros de carregamento e resultados
6. **Reutilização de Componentes**: Footer e outros elementos compartilhados
7. **Validação de Formulário**: Verificação de campos obrigatórios com feedback claro

## Melhorias Futuras

Com mais tempo, as seguintes melhorias seriam implementadas:

1. **Testes Automatizados**: Adicionar testes unitários e de integração
2. **Filtragem Avançada**: Adicionar mais campos de filtro e opções de busca
3. **Sistema de Login**: Implementar autenticação para salvar preferências
4. **Histórico de Matches**: Salvar histórico de buscas anteriores
5. **IA Real**: Substituir a simulação por algoritmos de machine learning reais
6. **Internacionalização**: Suporte a múltiplos idiomas
7. **Acessibilidade**: Melhorar suporte a tecnologias assistivas
8. **Perfis Detalhados**: Exibir mais informações sobre cada match
9. **Filtros de Similaridade**: Permitir configuração dos parâmetros de similaridade
10. **Métricas de Uso**: Implementar sistema de análise de uso da aplicação

## Considerações sobre o Código

O código foi desenvolvido com foco em:

- **Clareza e Legibilidade**: Nomes descritivos e estrutura lógica
- **Modularidade**: Funções com responsabilidades bem definidas
- **Eficiência**: Algoritmos otimizados para cálculo de similaridade
- **Manutenibilidade**: Código organizado e bem documentado
- **Escalabilidade**: Estrutura que facilita adição de novas funcionalidades
- **Experiência do Usuário**: Feedback visual durante operações assíncronas

## Autor

[Kauan Vidigal] - Desenvolvedor Full Stack
