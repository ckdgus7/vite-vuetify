import monaco from 'monaco-editor';

export const registerPlantUMLLanguage = () => {
  monaco.languages.register({ id: 'plantuml' })

  monaco.languages.setMonarchTokensProvider('plantuml', {
    tokenizer: {
      root: [
        [/^@startuml/, 'keyword'],
        [/^@enduml/, 'keyword'],
        [/\b(actor|participant|usecase|class|interface|enum|component|state|object)\b/, 'type'],
        [/\b(as|extends|implements|<<|>>)\b/, 'keyword'],
        [/".*?"/, 'string'],
        [/'.*$/, 'comment'],
        [/(->|-->|<-|<--|==)/, 'operator'],
        [/\[.*?\]/, 'annotation'],
        [/\b(note|left|right|of)\b/, 'tag']
      ]
    }
  })

  monaco.languages.setLanguageConfiguration('plantuml', {
    comments: {
      lineComment: "'"
    },
    brackets: [['[', ']'], ['{', '}']],
    autoClosingPairs: [{ open: '"', close: '"' }]
  })
}
