export default {
  StripSpecialChars: (str: string) =>
    str.replace(/[^a-zA-Z0-9 \-\+\=\[\]{}\\|;:'",<.>\/?~!@#$%^&*()_]/g, ''),

  AddCommas: (num: number) => num.toLocaleString(),

  AddUnderscores: (str: number) => str.toLocaleString().replace(',', '_'),

  PadEnd: (str: string, length: number) => str.padEnd(length, ' '),
}
