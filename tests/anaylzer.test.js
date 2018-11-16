const { run } = require('../lib/analyzer');

test('$()', () => {
  expect(run(`const a = $('.some-selector');`).get('$()')).toBe(1);
  let template = `
    $('.hello');
    const a = $('.some-selector');
    $().ajax();
  `;
  expect(run(template).get('$()')).toBe(2);
});

test('.on', () => {
  expect(run(`$('.selector').on('click', () => console.log('boo'));`).get('on')).toBe(1);
});

test('.off', () => {
  expect(run(`$('.selector').off('click');`).get('off')).toBe(1);
});
