import 'package:flutter/material.dart';

import '../../utils/currency_formatter.dart';

class InvestorsPage extends StatelessWidget {
  const InvestorsPage({super.key, required this.onLogout});
  final VoidCallback onLogout;

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      _TopBar(onLogout: onLogout),
      Expanded(
        child: Container(
          color: const Color(0xFFF8FAFC),
          child: ListView(
            padding: const EdgeInsets.all(32),
            children: const [
              _Header(),
              SizedBox(height: 28),
              _StatsGrid(),
              SizedBox(height: 28),
              _InvestorTableCard(),
              SizedBox(height: 72),
              _Footer(),
            ],
          ),
        ),
      ),
    ]);
  }
}

class _TopBar extends StatelessWidget {
  const _TopBar({required this.onLogout});
  final VoidCallback onLogout;
  @override
  Widget build(BuildContext context) => Container(
        height: 76,
        padding: const EdgeInsets.symmetric(horizontal: 28),
        decoration: const BoxDecoration(color: Colors.white, boxShadow: [BoxShadow(color: Color(0x140F172A), blurRadius: 20, offset: Offset(0, 4))]),
        child: Row(mainAxisAlignment: MainAxisAlignment.end, children: [
          _IconTile(icon: Icons.dark_mode_outlined, onTap: () {}),
          const SizedBox(width: 12),
          _IconTile(icon: Icons.settings_outlined, onTap: () {}),
          const SizedBox(width: 16),
          Container(
            height: 44,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(border: Border.all(color: const Color(0xFFE2E8F0)), borderRadius: BorderRadius.circular(10)),
            child: const Row(children: [Icon(Icons.person_outline, size: 20), SizedBox(width: 10), Text('admin', style: TextStyle(fontWeight: FontWeight.w700)), SizedBox(width: 14), Icon(Icons.keyboard_arrow_down)]),
          ),
          const SizedBox(width: 16),
          SizedBox(height: 48, child: FilledButton.icon(style: FilledButton.styleFrom(backgroundColor: const Color(0xFF16A34A), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))), onPressed: onLogout, icon: const Icon(Icons.logout, size: 18), label: const Text('Logout'))),
        ]),
      );
}

class _IconTile extends StatelessWidget { const _IconTile({required this.icon, required this.onTap}); final IconData icon; final VoidCallback onTap; @override Widget build(BuildContext context)=>InkWell(onTap:onTap,borderRadius:BorderRadius.circular(22),child:Container(width:44,height:44,decoration:const BoxDecoration(color:Color(0xFFF8FAFC),shape:BoxShape.circle),child:Icon(icon,color:Color(0xFF334155),size:20))); }

class _Header extends StatelessWidget { const _Header(); @override Widget build(BuildContext context)=>LayoutBuilder(builder:(context,c)=>Wrap(alignment:WrapAlignment.spaceBetween,crossAxisAlignment:WrapCrossAlignment.center,runSpacing:16,children:[const SizedBox(width:700,child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[Text('INVESTOR FUNDING',style:TextStyle(color:Color(0xFF16A34A),fontSize:13,fontWeight:FontWeight.w900,letterSpacing:.5)),SizedBox(height:12),Text('Investors',style:TextStyle(color:Color(0xFF0F172A),fontSize:34,fontWeight:FontWeight.w900)),SizedBox(height:10),Text('Manage investors, funding agreements, balances and accrued interest.',style:TextStyle(color:Color(0xFF475569),fontSize:16))])),_PrimaryButton(label:'Add Investor',icon:Icons.add,onPressed:() {})])); }

class _StatsGrid extends StatelessWidget { const _StatsGrid(); @override Widget build(BuildContext context){final stats=[('Total Investors','1','All registered investors',Icons.group_outlined,const Color(0xFF16A34A)),('Active Investors','1','Currently active investors',Icons.person_pin_outlined,const Color(0xFF3B82F6)),('Active Agreements','1','Active funding agreements',Icons.description_outlined,const Color(0xFF8B5CF6)),('Total Principal',formatCurrency(50000),'Outstanding principal',Icons.account_balance_wallet_outlined,const Color(0xFFF97316)),('Accrued Interest',formatCurrency(0),'Total accrued interest',Icons.percent_outlined,const Color(0xFFDB2777))];return LayoutBuilder(builder:(context,c){final width=c.maxWidth>=1200?(c.maxWidth-64)/5:c.maxWidth>=760?(c.maxWidth-32)/3:c.maxWidth;return Wrap(spacing:16,runSpacing:16,children:stats.map((s)=>SizedBox(width:width,child:_StatCard(title:s.$1,value:s.$2,subtitle:s.$3,icon:s.$4,color:s.$5))).toList());});}}
class _StatCard extends StatelessWidget { const _StatCard({required this.title,required this.value,required this.subtitle,required this.icon,required this.color}); final String title,value,subtitle; final IconData icon; final Color color; @override Widget build(BuildContext context)=>AnimatedContainer(duration:const Duration(milliseconds:200),height:124,padding:const EdgeInsets.all(20),decoration:BoxDecoration(color:Colors.white,borderRadius:BorderRadius.circular(16),border:Border.all(color:const Color(0xFFE2E8F0)),boxShadow:const [BoxShadow(color:Color(0x120F172A),blurRadius:18,offset:Offset(0,8))]),child:Row(children:[CircleAvatar(radius:30,backgroundColor:color.withOpacity(.12),child:Icon(icon,color:color,size:30)),const SizedBox(width:18),Expanded(child:Column(crossAxisAlignment:CrossAxisAlignment.start,mainAxisAlignment:MainAxisAlignment.center,children:[Text(title,style:const TextStyle(color:Color(0xFF64748B),fontWeight:FontWeight.w700)),const SizedBox(height:8),Text(value,style:const TextStyle(color:Color(0xFF0F172A),fontSize:24,fontWeight:FontWeight.w900)),const SizedBox(height:8),Text(subtitle,style:const TextStyle(color:Color(0xFF64748B),fontSize:13))]))]));}

class _InvestorTableCard extends StatelessWidget { const _InvestorTableCard(); @override Widget build(BuildContext context)=>Container(padding:const EdgeInsets.all(24),decoration:BoxDecoration(color:Colors.white,borderRadius:BorderRadius.circular(16),border:Border.all(color:const Color(0xFFE2E8F0)),boxShadow:const [BoxShadow(color:Color(0x140F172A),blurRadius:24,offset:Offset(0,12))]),child:Column(children:[const _Toolbar(),const SizedBox(height:24),ClipRRect(borderRadius:BorderRadius.circular(12),child:LayoutBuilder(builder:(context,c)=>SingleChildScrollView(scrollDirection:Axis.horizontal,child:ConstrainedBox(constraints:BoxConstraints(minWidth:c.maxWidth),child:DataTable(headingRowColor:WidgetStateProperty.all(const Color(0xFFF8FAFC)),dataRowMinHeight:92,dataRowMaxHeight:124,columnSpacing:28,columns:['Investor Number','Investor Name','Type','NIC / Registration No.','Mobile','Active Agreements','Principal Balance','Accrued Interest','Status','Actions'].map((h)=>DataColumn(label:Text(h,style:const TextStyle(fontWeight:FontWeight.w900,color:Color(0xFF0F172A))))).toList(),rows:[DataRow(color:WidgetStateProperty.resolveWith((_)=>Colors.white),cells:[const DataCell(Text('GROW-INV-\n000001',style:TextStyle(color:Color(0xFF059669),fontWeight:FontWeight.w900,height:1.8))),const DataCell(Text('Prakash Vij ayanga\nWithanachchi',style:TextStyle(height:1.8,color:Color(0xFF334155),fontWeight:FontWeight.w600))),DataCell(_Badge('INDIVIDUAL',const Color(0xFF2563EB))),const DataCell(Text('198900701481')),const DataCell(Text('0703322111')),const DataCell(Center(child:Text('1'))),DataCell(Text(formatCurrency(50000),style:const TextStyle(color:Color(0xFF059669),fontWeight:FontWeight.w800))),DataCell(Text(formatCurrency(0))),DataCell(_Badge('● ACTIVE',const Color(0xFF16A34A),soft:true)),const DataCell(_Actions())])]))))),const Divider(height:44),Row(children:[const Expanded(child:Text('Showing 1 to 1 of 1 investors',style:TextStyle(color:Color(0xFF475569)))),IconButton(onPressed:null,icon:Icon(Icons.chevron_left)),Container(width:40,height:40,alignment:Alignment.center,decoration:BoxDecoration(color:Color(0xFF16A34A),borderRadius:BorderRadius.circular(10)),child:Text('1',style:TextStyle(color:Colors.white,fontWeight:FontWeight.bold))),IconButton(onPressed:null,icon:Icon(Icons.chevron_right)),SizedBox(width:16),OutlinedButton(onPressed:null,child:Text('10 / page'))]) ]));}

class _Toolbar extends StatelessWidget { const _Toolbar(); @override Widget build(BuildContext context)=>Wrap(spacing:16,runSpacing:12,crossAxisAlignment:WrapCrossAlignment.center,children:[SizedBox(width:430,height:48,child:TextField(decoration:InputDecoration(hintText:'Search by investor number, name, NIC or mobile...',prefixIcon:const Icon(Icons.search),border:OutlineInputBorder(borderRadius:BorderRadius.circular(10))))),_Select(label:'All Types'),_Select(label:'All Statuses'),SizedBox(height:48,child:OutlinedButton.icon(onPressed:(){},icon:const Icon(Icons.refresh),label:const Text('Refresh'))),const SizedBox(width:80),SizedBox(height:48,child:OutlinedButton.icon(onPressed:(){},icon:const Icon(Icons.download),label:const Text('Export')))]); }
class _Select extends StatelessWidget { const _Select({required this.label}); final String label; @override Widget build(BuildContext context)=>SizedBox(width:190,height:48,child:DropdownButtonFormField<String>(value:label,decoration:InputDecoration(border:OutlineInputBorder(borderRadius:BorderRadius.circular(10))),items:[DropdownMenuItem(value:label,child:Text(label))],onChanged:(_){},)); }
class _Badge extends StatelessWidget { const _Badge(this.text,this.color,{this.soft=false}); final String text; final Color color; final bool soft; @override Widget build(BuildContext context)=>Container(padding:const EdgeInsets.symmetric(horizontal:9,vertical:5),decoration:BoxDecoration(color:color.withOpacity(.14),borderRadius:BorderRadius.circular(99)),child:Text(text,style:TextStyle(color:color,fontSize:12,fontWeight:FontWeight.w900))); }
class _Actions extends StatelessWidget { const _Actions(); @override Widget build(BuildContext context)=>Column(mainAxisSize:MainAxisSize.min,children:[Row(children:[_SquareIcon(Icons.visibility_outlined),SizedBox(width:8),_SquareIcon(Icons.edit_outlined),SizedBox(width:8),_SquareIcon(Icons.more_vert)]),SizedBox(height:16),OutlinedButton.icon(onPressed:(){},icon:Icon(Icons.add,size:18),label:Text('New Agreement'),style:OutlinedButton.styleFrom(foregroundColor:Color(0xFF16A34A),side:BorderSide(color:Color(0xFF86EFAC))))]); }
class _SquareIcon extends StatelessWidget { const _SquareIcon(this.icon); final IconData icon; @override Widget build(BuildContext context)=>Container(width:40,height:40,decoration:BoxDecoration(border:Border.all(color:Color(0xFFCBD5E1)),borderRadius:BorderRadius.circular(8)),child:Icon(icon,size:19,color:Color(0xFF475569))); }
class _PrimaryButton extends StatelessWidget { const _PrimaryButton({required this.label,required this.icon,required this.onPressed}); final String label; final IconData icon; final VoidCallback onPressed; @override Widget build(BuildContext context)=>SizedBox(height:48,child:FilledButton.icon(onPressed:onPressed,icon:Icon(icon),label:Text(label),style:FilledButton.styleFrom(backgroundColor:Color(0xFF16A34A),shape:RoundedRectangleBorder(borderRadius:BorderRadius.circular(10)),elevation:4))); }
class _Footer extends StatelessWidget { const _Footer(); @override Widget build(BuildContext context)=>Row(children:const [Expanded(child:Text('© 2026 Grow Microfinance')),Text('Version 1.0   '),Text('●  System Operational',style:TextStyle(color:Color(0xFF16A34A),fontWeight:FontWeight.w800))]); }
