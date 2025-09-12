// Simple code runner using the public Piston API
// Docs: https://github.com/engineer-man/piston

const PISTON_URL = 'https://emkc.org/api/v2/piston/execute';

const monacoToPiston = (language) => {
  const lang = (language || '').toLowerCase();
  // Map Monaco languages to Piston runtimes
  switch (lang) {
    case 'javascript':
    case 'typescript':
      return { runtime: 'javascript', version: '18.15.0', file: 'main.js' };
    case 'python':
      return { runtime: 'python', version: '3.10.0', file: 'main.py' };
    case 'java':
      return { runtime: 'java', version: '15.0.2', file: 'Main.java' };
    case 'cpp':
    case 'c++':
      return { runtime: 'cpp', version: '10.2.0', file: 'main.cpp' };
    case 'c':
      return { runtime: 'c', version: '10.2.0', file: 'main.c' };
    case 'go':
      return { runtime: 'go', version: '1.16.2', file: 'main.go' };
    case 'ruby':
      return { runtime: 'ruby', version: '3.0.1', file: 'main.rb' };
    case 'php':
      return { runtime: 'php', version: '8.0.2', file: 'main.php' };
    case 'rust':
      return { runtime: 'rust', version: '1.68.2', file: 'main.rs' };
    case 'kotlin':
      return { runtime: 'kotlin', version: '1.8.20', file: 'Main.kt' };
    case 'swift':
      return { runtime: 'swift', version: '5.3.3', file: 'main.swift' };
    case 'bash':
    case 'shell':
      return { runtime: 'bash', version: '5.1.0', file: 'main.sh' };
    case 'html':
    case 'css':
    case 'json':
    case 'markdown':
      // Not directly runnable as programs; treat as plain text
      return null;
    default:
      return null;
  }
};

export async function runCodeRemotely(language, code, stdin = '') {
  const mapping = monacoToPiston(language);
  if (!mapping) {
    return { ok: false, output: `[info] Running for '${language}' is not supported by the remote runner.` };
  }

  try {
    const res = await fetch(PISTON_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: mapping.runtime,
        version: mapping.version,
        files: [{ name: mapping.file, content: code }],
        stdin
      })
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, output: `[runner error] ${res.status} ${text}` };
    }
    const data = await res.json();
    const out = `${data.run?.stdout || ''}${data.run?.stderr || ''}`.trim();
    return { ok: true, output: out || '(no output)' };
  } catch (e) {
    return { ok: false, output: `[network error] ${e?.message || String(e)}` };
  }
}


