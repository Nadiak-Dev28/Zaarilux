import { brand, emailCopy as c, ui } from '../src/data/content.ts';
import { money } from '../src/data/products.ts';

const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character],
  );

export function buildOrderEmail(order, number) {
  const customer = order.customer;
  const details = [
    [c.name, customer.name],
    [c.phone, customer.phone],
    [c.email, customer.email || c.missing],
    [c.address, customer.address],
    [c.city, customer.city],
    [c.notes, customer.notes || c.noNotes],
    [c.timestamp, order.timestamp],
  ];
  const totals = [
    [ui.subtotal, money(order.subtotal)],
    [ui.shipping, order.shipping ? money(order.shipping) : ui.free],
    [c.due, money(order.total)],
  ];
  const textRows = (rows) => rows.map(([label, value]) => `${label}: ${value}`);
  const htmlRows = (rows) =>
    rows
      .map(
        ([label, value]) => `<tr>
    <td style="padding:5px 14px 5px 0;color:#62665f;vertical-align:top">${escape(label)}</td>
    <td style="padding:5px 0">${escape(value)}</td></tr>`,
      )
      .join('');
  const text = [
    c.subject(number),
    ...textRows(details),
    '',
    ui.summary,
    ...order.items.map(
      (i) =>
        `${i.qty} x ${i.name} (${i.size}, ${i.color}) @ ${money(i.unitPrice)} = ${money(i.qty * i.unitPrice)}`,
    ),
    '',
    ...textRows(totals),
    `${c.payment}: ${ui.cod}`,
    c.instruction,
  ].join('\n');
  const html = `<!doctype html>
  <html lang="en"><body style="margin:0;background:#f5f4ee;color:#303a30;font-family:Arial,sans-serif">
    <div style="max-width:680px;margin:auto;padding:32px 20px">
      <div style="padding:24px;background:#53694f;color:#fff">
        <div style="font:32px Georgia,serif">${escape(brand.name)}</div>
        <p>${escape(c.newOrder)}</p><h1 style="font-size:24px;margin-bottom:0">${escape(number)}</h1>
      </div>
      <div style="background:#fff;padding:24px">
        <h2 style="font:23px Georgia,serif">${escape(c.details)}</h2>
        <table>${htmlRows(details)}</table>
        <h2 style="font:23px Georgia,serif">${escape(ui.summary)}</h2>
        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-size:14px">
          <thead style="background:#edf0e8;text-align:left"><tr>${[c.item, c.qty, c.price, ui.total].map((label) => `<th>${escape(label)}</th>`).join('')}</tr></thead>
          <tbody>${order.items.map((i) => `<tr><td style="border-bottom:1px solid #ddd">${escape(i.name)}<br><small>${escape(i.size)} / ${escape(i.color)}</small></td><td>${i.qty}</td><td>${money(i.unitPrice)}</td><td>${money(i.qty * i.unitPrice)}</td></tr>`).join('')}</tbody>
        </table>
        <table style="margin:18px 0 0 auto">${htmlRows(totals)}</table>
        <p style="padding-top:16px;border-top:1px solid #ddd">${escape(c.payment)}: <strong>${escape(ui.cod)}</strong>. ${escape(c.instruction)}</p>
      </div>
    </div>
  </body></html>`;
  return { subject: c.subject(number), html, text };
}
