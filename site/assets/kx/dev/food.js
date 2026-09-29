// Галерея еды и посуды: #/dev/kxfood[/страница]  (по 20 штук на страницу)
import { FOODS, SIZE, food } from '../food.js'

const PER = 20
export default {
  backdrop: '#FFF3E6',
  music: 'none',
  hud: { home: '/dev' },
  mount(k) {
    const names = Object.keys(FOODS)
    const pages = Math.ceil(names.length / PER)
    const page = Math.max(1, Math.min(pages, Number(k.params[0]) || 1))
    const cells = names.slice((page - 1) * PER, page * PER).map((n, i) => {
      const [w, h] = SIZE[n]
      const cw = 290, ch = 210, sc = Math.min((cw - 30) / w, (ch - 50) / h)
      const x = 20 + (i % 5) * 310, y = 40 + Math.floor(i / 5) * 230
      return `<div style="position:absolute;left:${x}px;top:${y}px;width:${cw}px;height:${ch}px;background:rgba(255,255,255,.7);border-radius:18px">
        <div style="position:absolute;left:${(cw - w * sc) / 2}px;top:${(ch - 30 - h * sc) / 2 + 4}px;width:${w * sc}px;height:${h * sc}px">${food(n)}</div>
        <div style="position:absolute;left:0;right:0;bottom:6px;text-align:center;font:800 18px var(--font);color:#3B2F4F">${n}</div></div>`
    }).join('')
    const nav = Array.from({ length: pages }, (_, i) => `<a href="#/dev/kxfood/${i + 1}" style="font:800 20px var(--font);background:#fff;padding:6px 14px;border-radius:12px;text-decoration:none;color:#3B2F4F;margin-left:8px">${i + 1}</a>`).join('')
    k.root.innerHTML = `<div style="position:absolute;inset:0;background:#FFF3E6"></div>${cells}<div style="position:absolute;right:20px;bottom:14px">${nav}</div>`
  },
}
