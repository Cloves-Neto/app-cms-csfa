Implemente a funcionalidade de calendário da aplicação seguindo as instruções abaixo.

## Objetivo

A aplicação possui uma agenda escolar. O calendário é exibido na tela principal e deve combinar:

1. Eventos cadastrados pelos usuários;
2. Eventos da própria instituição/escola;
3. Feriados nacionais;
4. Feriados estaduais;
5. Datas comemorativas relevantes;
6. Respeito à localização e ao fuso horário configurados para a instituição.

Não quero implementar manualmente a lógica de geração do calendário através de um array de todas as datas do mês.

---

## 1. Biblioteca de calendário

Utilize uma biblioteca consolidada para renderização do calendário.

Preferencialmente utilize **FullCalendar**, caso seja compatível com a stack atual do projeto.

Utilize os plugins necessários para:

* visualização mensal;
* visualização semanal;
* visualização diária, se fizer sentido para a aplicação;
* interação com datas;
* eventos;
* eventos de dia inteiro.

A biblioteca deve ser responsável pela **renderização e navegação do calendário**, enquanto os dados devem continuar vindo da aplicação/API.

Não criar manualmente uma implementação de calendário baseada em arrays contendo todos os dias do mês.

---

## 2. Estrutura dos eventos

Padronize os eventos utilizando uma estrutura semelhante a:

```ts
type CalendarEvent = {
  id: string
  title: string
  start: string
  end?: string
  allDay?: boolean
  type:
    | 'USER_EVENT'
    | 'SCHOOL_EVENT'
    | 'NATIONAL_HOLIDAY'
    | 'STATE_HOLIDAY'
    | 'MUNICIPAL_HOLIDAY'
    | 'COMMEMORATIVE_DATE'
}
```

Adapte os nomes à arquitetura existente caso já exista uma estrutura equivalente.

O frontend deve receber eventos em formato compatível com o componente de calendário.

---

## 3. Datas comemorativas e feriados

Para feriados e datas oficiais, utilize uma biblioteca adequada em vez de criar manualmente um array fixo de datas.

Preferencialmente utilizar:

```text
date-holidays
```

A biblioteca deve ser utilizada no backend para obter os feriados de acordo com:

* país;
* estado/região;
* ano;
* timezone quando aplicável.

Para o Brasil, considerar inicialmente:

```text
country: BR
state: SP
```

Porém, **não deixar BR/SP hardcoded na lógica**.

A localização deve ser configurável pela instituição.

Exemplo conceitual:

```ts
{
  country: 'BR',
  state: 'SP',
  city: 'São Bernardo do Campo',
  timezone: 'America/Sao_Paulo'
}
```

---

## 4. Datas comemorativas

Além dos feriados legais, permitir a inclusão de datas comemorativas.

Diferenciar claramente:

### Feriado

```text
NATIONAL_HOLIDAY
STATE_HOLIDAY
MUNICIPAL_HOLIDAY
```

### Data comemorativa

```text
COMMEMORATIVE_DATE
```

Datas comemorativas não devem ser automaticamente tratadas como feriados.

Por exemplo:

```text
Dia das Mães
Dia dos Pais
Dia da Consciência Negra
Dia do Professor
etc.
```

A classificação deve permanecer separada para que a interface possa apresentar essas datas de maneira diferente.

---

## 5. Calendário escolar

Não confundir feriados com eventos específicos do calendário escolar.

O sistema também deve permitir eventos como:

* início das aulas;
* término das aulas;
* férias;
* recesso escolar;
* reuniões de pais;
* provas;
* eventos escolares;
* conselho de classe;
* dias letivos;
* atividades especiais.

Esses eventos pertencem à aplicação e devem ser armazenados no banco de dados.

A biblioteca de feriados não deve ser utilizada para representar regras específicas da escola.

---

## 6. Arquitetura

A arquitetura desejada é:

```text
                    API / Backend
                          |
             ┌────────────┴────────────┐
             |                         |
      Eventos do banco           Feriados
             |                  date-holidays
             |                         |
             └────────────┬────────────┘
                          |
                   CalendarEvent[]
                          |
                          v
                    Frontend
                          |
                    FullCalendar
```

O frontend não deve precisar conhecer as regras para calcular feriados.

Ele deve receber os eventos já normalizados pela API.

---

## 7. API

Caso ainda não exista um endpoint específico, criar algo semelhante a:

```http
GET /calendar/events
```

Possíveis parâmetros:

```text
start
end
schoolId
```

Exemplo:

```http
GET /calendar/events?start=2026-09-01&end=2026-09-30
```

A API deve retornar os eventos daquele intervalo.

Exemplo:

```json
[
  {
    "id": "event-123",
    "title": "Prova de Matemática",
    "start": "2026-09-28T08:00:00-03:00",
    "end": "2026-09-28T10:00:00-03:00",
    "allDay": false,
    "type": "SCHOOL_EVENT"
  },
  {
    "id": "holiday-2026-10-12",
    "title": "Nossa Senhora Aparecida",
    "start": "2026-10-12",
    "allDay": true,
    "type": "NATIONAL_HOLIDAY"
  }
]
```

Evitar armazenar automaticamente cada ocorrência de feriado no banco apenas para poder exibi-la.

Os feriados podem ser calculados/obtidos pela camada de serviço e combinados com os eventos persistidos.

---

## 8. Timezone

Tratar timezone explicitamente.

Não utilizar simplesmente:

```ts
new Date('2026-09-28')
```

sem considerar os problemas de timezone.

A instituição deve possuir um timezone configurado, por exemplo:

```text
America/Sao_Paulo
```

Eventos com horário devem respeitar esse timezone.

Eventos de dia inteiro devem ser tratados como `allDay` para evitar deslocamentos de data causados por conversão UTC.

---

## 9. Frontend

No frontend:

* remover a lógica manual de geração do calendário caso exista;
* utilizar FullCalendar;
* consumir os eventos da API;
* diferenciar visualmente os tipos de evento;
* permitir navegação entre meses;
* permitir selecionar/visualizar um evento;
* manter a interface consistente com o design atual da aplicação.

Não alterar desnecessariamente outras partes da aplicação.

---

## 10. Regras importantes

Antes de implementar:

1. Analise a estrutura atual do projeto.
2. Identifique como os eventos estão atualmente armazenados.
3. Reaproveite entidades, services, controllers e tipos existentes quando possível.
4. Não duplique modelos ou regras que já existem.
5. Não hardcode datas de feriados se uma biblioteca puder fornecer essas informações.
6. Não hardcode localização ou timezone.
7. Não transformar todos os dias do mês em registros no banco.
8. Mantenha feriados, datas comemorativas e eventos escolares conceitualmente separados.
9. Preserve a compatibilidade com os eventos existentes.
10. Se houver testes no projeto, adicione ou atualize testes para a nova lógica.

## Resultado esperado

Ao final, a tela principal deve apresentar um calendário funcional contendo, no mesmo componente:

* eventos dos usuários;
* eventos escolares;
* feriados nacionais;
* feriados estaduais;
* eventualmente municipais;
* datas comemorativas.

A origem de cada evento deve estar disponível através do campo `type`, permitindo que o frontend faça a diferenciação visual.

A implementação deve ser modular, tipada e preparada para futuramente suportar outras localidades além de São Paulo/Brasil.
