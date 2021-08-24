import 'katex/dist/katex.min.css';
import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import styles from './LaTexDoc.less';

export default function LaTexDoc() {
  return (
    <div className={styles.latexDoc}>
      <h1>LaTex 表达式大全</h1>
      <table className={styles.docTable} border="0" cellPadding="10" cellSpacing="0">
        <caption>字母上标</caption>
        <thead>
          <tr>
            <th align="center" style={{ width: '50%' }}>
              符号
            </th>
            <th align="center" style={{ width: '50%' }}>
              语法
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <InlineMath math="\hat{a}" />
            </td>
            <td>{String.raw`\hat{a}`}</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\grave{a}`} />
            </td>
            <td>{String.raw`\grave{a}`}</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\bar{a}`} />
            </td>
            <td>{String.raw`\bar{a}`}</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\check{a}`} />
            </td>
            <td>{String.raw`\check{a}`}</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\vec{a}`} />
            </td>
            <td>{String.raw`\vec{a}`}</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\tilde{a}`} />
            </td>
            <td>{String.raw`\tilde{a}`}</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\dot{a}`} />
            </td>
            <td>{String.raw`\dot{a}`}</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\ddot{a}`} />
            </td>
            <td>{String.raw`\ddot{a}`}</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\widehat{a}`} />
            </td>
            <td>{String.raw`\widehat{a}`}</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="a^2" />
            </td>
            <td>a^2</td>
          </tr>
        </tbody>
      </table>
      <table className={styles.docTable} border="0" cellPadding="10" cellSpacing="0">
        <caption>希腊字母</caption>
        <thead>
          <tr>
            <th align="center" style={{ width: '25%' }}>
              小写符号
            </th>
            <th align="center" style={{ width: '25%' }}>
              语法
            </th>
            <th align="center" style={{ width: '25%' }}>
              大写符号
            </th>
            <th align="center" style={{ width: '25%' }}>
              语法
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <InlineMath math="\alpha" />
            </td>
            <td>\alpha</td>
            <td>
              <InlineMath math="A" />
            </td>
            <td>A</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\beta" />
            </td>
            <td>\beta</td>
            <td>
              <InlineMath math="B" />
            </td>
            <td>B</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\gamma" />
            </td>
            <td>\gamma</td>
            <td>
              <InlineMath math="\Gamma" />
            </td>
            <td>\Gamma</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\delta" />
            </td>
            <td>\delta</td>
            <td>
              <InlineMath math="\Delta" />
            </td>
            <td>\Delta</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\epsilon" />
            </td>
            <td>\epsilon</td>
            <td>
              <InlineMath math="E" />
            </td>
            <td>E</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\varepsilon`} />
            </td>
            <td>\varepsilon</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\zeta`} />
            </td>
            <td>\zeta</td>
            <td>
              <InlineMath math="Z" />
            </td>
            <td>Z</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\eta`} />
            </td>
            <td>\eta</td>
            <td>
              <InlineMath math="H" />
            </td>
            <td>H</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\theta`} />
            </td>
            <td>\theta</td>
            <td>
              <InlineMath math="\Theta" />
            </td>
            <td>\Theta</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\vartheta`} />
            </td>
            <td>\vartheta</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\iota`} />
            </td>
            <td>\iota</td>
            <td>
              <InlineMath math="I" />
            </td>
            <td>I</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\kappa`} />
            </td>
            <td>\kappa</td>
            <td>
              <InlineMath math="K" />
            </td>
            <td>K</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\lambda`} />
            </td>
            <td>\lambda</td>
            <td>
              <InlineMath math="\Lambda" />
            </td>
            <td>\Lambda</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\mu`} />
            </td>
            <td>\mu</td>
            <td>
              <InlineMath math="M" />
            </td>
            <td>M</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\nu`} />
            </td>
            <td>\nu</td>
            <td>
              <InlineMath math="N" />
            </td>
            <td>N</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\xi" />
            </td>
            <td>\xi</td>
            <td>
              <InlineMath math="\Xi" />
            </td>
            <td>\Xi</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="o" />
            </td>
            <td>o</td>
            <td>
              <InlineMath math="O" />
            </td>
            <td>O</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\pi`} />
            </td>
            <td>\pi</td>
            <td>
              <InlineMath math="\Pi" />
            </td>
            <td>\Pi</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\varpi`} />
            </td>
            <td>\varpi</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\rho`} />
            </td>
            <td>\rho</td>
            <td>
              <InlineMath math="P" />
            </td>
            <td>P</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\varrho`} />
            </td>
            <td>\varrho</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\sigma`} />
            </td>
            <td>\sigma</td>
            <td>
              <InlineMath math={String.raw`\Sigma`} />
            </td>
            <td>\Sigma</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\varsigma`} />
            </td>
            <td>\varsigma</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\tau`} />
            </td>
            <td>\tau</td>
            <td>
              <InlineMath math="T" />
            </td>
            <td>T</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\upsilon" />
            </td>
            <td>\upsilon</td>
            <td>
              <InlineMath math="\Upsilon" />
            </td>
            <td>\Upsilon</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\phi" />
            </td>
            <td>\phi</td>
            <td>
              <InlineMath math="\Phi" />
            </td>
            <td>\Phi</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\chi" />
            </td>
            <td>\chi</td>
            <td>
              <InlineMath math="X" />
            </td>
            <td>X</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\psi" />
            </td>
            <td>\psi</td>
            <td>
              <InlineMath math="\Psi" />
            </td>
            <td>\Psi</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\omega" />
            </td>
            <td>\omega</td>
            <td>
              <InlineMath math="\Omega" />
            </td>
            <td>\Omega</td>
          </tr>
        </tbody>
      </table>
      <table className={styles.docTable} border="0" cellPadding="10" cellSpacing="0">
        <caption>二元关系符</caption>
        <thead>
          <tr>
            <th align="center" style={{ width: '30%' }}>
              符号
            </th>
            <th align="center" style={{ width: '30%' }}>
              语法
            </th>
            <th align="center" style={{ width: '40%' }}>
              注释
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <InlineMath math="<" />
            </td>
            <td>{String.raw`<`}</td>
            <td>小于</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\leq`} />
            </td>
            <td>\leq</td>
            <td>小于等于</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\ll" />
            </td>
            <td>\ll</td>
            <td>远小于</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\prec`} />
            </td>
            <td>\prec</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\preceq`} />
            </td>
            <td>\preceq</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\subset`} />
            </td>
            <td>\subset</td>
            <td>真子集</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\subseteq`} />
            </td>
            <td>\subseteq</td>
            <td>子集</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\in" />
            </td>
            <td>\in</td>
            <td>属于</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\mid" />
            </td>
            <td>\mid</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\smile" />
            </td>
            <td>\smile</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math=">" />
            </td>
            <td>{String.raw`>`}</td>
            <td>大于</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\geq" />
            </td>
            <td>\geq</td>
            <td>大于等于</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\gg" />
            </td>
            <td>\gg</td>
            <td>远大于</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\succ" />
            </td>
            <td>\succ</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\succeq" />
            </td>
            <td>\succeq</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\supset" />
            </td>
            <td>\supset</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\supseteq" />
            </td>
            <td>\supseteq</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\ni" />
            </td>
            <td>\ni</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\parallel" />
            </td>
            <td>\parallel</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\frown" />
            </td>
            <td>\frown</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\notin" />
            </td>
            <td>\notin</td>
            <td>不属于</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="=" />
            </td>
            <td>=</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\equiv" />
            </td>
            <td>\equiv</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\doteq" />
            </td>
            <td>\doteq</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\sim" />
            </td>
            <td>\sim</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\simeq" />
            </td>
            <td>\simeq</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\approx" />
            </td>
            <td>\approx</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\bowtie" />
            </td>
            <td>\bowtie</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\propto" />
            </td>
            <td>\propto</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\neq" />
            </td>
            <td>\neq</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\asymp" />
            </td>
            <td>\asymp</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
      <table className={styles.docTable} border="0" cellPadding="10" cellSpacing="0">
        <caption>二元运算符</caption>
        <thead>
          <tr>
            <th align="center" style={{ width: '30%' }}>
              符号
            </th>
            <th align="center" style={{ width: '30%' }}>
              语法
            </th>
            <th align="center" style={{ width: '40%' }}>
              注释
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <InlineMath math="+" />
            </td>
            <td>+</td>
            <td>加法</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\pm`} />
            </td>
            <td>\pm</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\cdot" />
            </td>
            <td>\cdot</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\times`} />
            </td>
            <td>\times</td>
            <td>乘法</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\cup`} />
            </td>
            <td>\cup</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\sqcup`} />
            </td>
            <td>\sqcup</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math={String.raw`\vee`} />
            </td>
            <td>\vee或\lor</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\oplus" />
            </td>
            <td>\oplus</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\odot" />
            </td>
            <td>\odot</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\otimes" />
            </td>
            <td>\otimes</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\bigtriangleup" />
            </td>
            <td>\bigtriangleup</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="-" />
            </td>
            <td>-</td>
            <td>减法</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\mp" />
            </td>
            <td>\mp</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\div" />
            </td>
            <td>\div</td>
            <td>除法</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\setminus" />
            </td>
            <td>\setminus</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\cap" />
            </td>
            <td>\cap</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\sqcap" />
            </td>
            <td>\sqcap</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\wedge" />
            </td>
            <td>\wedge或\land</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\ominus" />
            </td>
            <td>\ominus</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\oslash" />
            </td>
            <td>\oslash</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\bigcirc" />
            </td>
            <td>\bigcirc</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\bigtriangledown" />
            </td>
            <td>\bigtriangledown</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\triangleleft" />
            </td>
            <td>\triangleleft</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\triangleright" />
            </td>
            <td>\triangleright</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\star" />
            </td>
            <td>\star</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\ast" />
            </td>
            <td>\ast</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\circ" />
            </td>
            <td>\circ</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\bullet" />
            </td>
            <td>\bullet</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\diamond" />
            </td>
            <td>\diamond</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\uplus" />
            </td>
            <td>\uplus</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\amalg" />
            </td>
            <td>\amalg</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\dagger" />
            </td>
            <td>\dagger</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\ddagger" />
            </td>
            <td>\ddagger</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\wr" />
            </td>
            <td>\wr</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
      <table className={styles.docTable} border="0" cellPadding="10" cellSpacing="0">
        <caption>大尺寸运算符</caption>
        <thead>
          <tr>
            <th align="center" style={{ width: '30%' }}>
              符号
            </th>
            <th align="center" style={{ width: '30%' }}>
              语法
            </th>
            <th align="center" style={{ width: '40%' }}>
              注释
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <InlineMath math="\sum" />
            </td>
            <td>\sum</td>
            <td>求和</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\prod" />
            </td>
            <td>\prod</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\coprod" />
            </td>
            <td>\coprod</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\int" />
            </td>
            <td>\int</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\bigcup" />
            </td>
            <td>\bigcup</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\bigcap" />
            </td>
            <td>\bigcap</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\bigsqcup" />
            </td>
            <td>\bigsqcup</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\oint" />
            </td>
            <td>\oint</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\bigvee" />
            </td>
            <td>\bigvee</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\bigwedge" />
            </td>
            <td>\bigwedge</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\bigoplus" />
            </td>
            <td>\bigoplus</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\bigotimes" />
            </td>
            <td>\bigotimes</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\bigodot" />
            </td>
            <td>\bigodot</td>
            <td>-</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\biguplus" />
            </td>
            <td>\biguplus</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
      <table className={styles.docTable} border="0" cellPadding="10" cellSpacing="0">
        <caption>定界符</caption>
        <thead>
          <tr>
            <th align="center" style={{ width: '50%' }}>
              符号
            </th>
            <th align="center" style={{ width: '50%' }}>
              语法
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <InlineMath math="(" />
            </td>
            <td>(</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\lbrack" />
            </td>
            <td>\lbrack</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\lbrace" />
            </td>
            <td>\lbrace</td>
          </tr>
          <tr>
            <td>
              <InlineMath math=")" />
            </td>
            <td>)</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\rbrack" />
            </td>
            <td>\rbrack</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\rbrace" />
            </td>
            <td>\rbrace</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\rangle" />
            </td>
            <td>\rangle</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\uparrow" />
            </td>
            <td>\uparrow</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\downarrow" />
            </td>
            <td>\downarrow</td>
          </tr>
          <tr>
            <td>
              <InlineMath math="\updownarrow" />
            </td>
            <td>\updownarrow</td>
          </tr>
        </tbody>
      </table>
      <table className={styles.docTable} border="0" cellPadding="10" cellSpacing="0">
        <caption>公式示例</caption>
        <tbody>
          <tr>
            <td>
              <BlockMath math="c = \pm\sqrt{a^2 + b^2}" />
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: 'left' }}>{'c = \\pm\\sqrt{a^2 + b^2}'}</td>
          </tr>
          <tr>
            <td>
              <BlockMath math="\sum_{i=1}^{n}i=\frac{n(n+1)}{2}" />
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: 'left' }}>{'\\sum_{i=1}^{n}i=\\frac{n(n+1)}{2}'}</td>
          </tr>
          <tr>
            <td>
              <BlockMath math="A=\overbrace{(a+b)+\underbrace{(c+d)i}_{\text{虚数}}}^{\text{复数}}+(e+f)+\underline{(g+h)}" />
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: 'left' }}>
              {
                'A=\\overbrace{(a+b)+\\underbrace{(c+d)i}_{\\text{虚数}}}^{\\text{复数}}+(e+f)+\\underline{(g+h)}'
              }
            </td>
          </tr>
          <tr>
            <td>
              <BlockMath
                math={String.raw`\begin{array}{ccc}
a_{11} &  a_{12} & a_{13}\\
a_{21} &  a_{22} & a_{23}\\
a_{31} &  a_{32} & a_{33}
\end{array}`}
              />
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: 'left' }}>
              {String.raw`\begin{array}{ccc}`}
              <br />
              {String.raw`a_{11} & a_{12} & a_{13}\\`}
              <br />
              {String.raw`a_{21} & a_{22} & a_{23}\\`}
              <br />
              {String.raw`a_{31} & a_{32} & a_{33}`}
              <br />
              {String.raw`\end{array}`}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
