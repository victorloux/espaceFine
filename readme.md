## Demo ##

Voir [par ici](http://deadpx.github.io/espaceFine/).

## Introduction ##
    
espaceFine.js est un script permettant d’utiliser et de placer automatiquement des espaces fines insécables sur le Web. Il s’agit pour le moment encore d’une expérimentation, sûrement imparfaite mais qui satisfera les typographes passionnés en attendant une amélioration pour un usage plus généralisé sur des sites riches en contenu.
    
Le premier problème majeur avec l’espace fine insécable Unicode (U+8239) est son incompatibilité native avec certains navigateurs et certaines fontes, ce qui la rend impraticable à utiliser. Afin de pallier à ce problème, j'ai choisi une solution moins sémantique mais toutefois efficace : placer, avant chaque signe double, une espace insécable (`&nbsp;`) entourée d’un `<span>` d’un corps réduit*, rendant l’espace plus fine qu’une espace mot mais toujours insécable. Le deuxième problème majeur est sa difficulté à mettre en place : sur le Net, il est rarement possible et complexe de faire une correction orthotypographique sur tous les textes d'un site. C'est pourquoi espaceFine.js automatise cela : il vous suffit de l’appeler, et tous les signes doubles et guillemets seront corrigés.
    
espaceFine.js est une solution flexible. Il s’agit d’une fonction Javascript très légère (< 1kb minifiée), portable (fonctionne avec IE6+, Gecko et WebKit) et très simple à utiliser. Il est possible d’appliquer les espaces fines à certains éléments seulement et non toute la page, si vous le souhaitez. Sa modification est simple et vous pouvez facilement changer les caractères qui seront précédés d'une espace fine, modifier la chasse, ou utiliser le caractère Unicode dédié pour une solution plus propre, sans avoir recours à des `<span>`, mais cela reste à vos risques et périls (il y a un risque que l’espace disparaisse, soit remplacée par un carré ou un point d’interrogation sur certains navigateurs qui ne le reconnaissent pas).</p>
        
*L’espace mot a, dans la majorité des fontes, une chasse d’&frac14; de cadratin. Une espace fine a, en théorie, une chasse d’un cinquième de cadratin. Par défaut le nouveau corps est de 2/3 (0,67 em) fois celui d’une espace normale insécable afin de s'approcher le plus près de la taille d'une espace fine.</p>


## Utilisation ##
        
Il vous faut, en premier lieu, inclure le script espaceFine que vous pouvez [télécharger ici](https://github.com/DeadPx/espaceFine/zipball/master) ou avec `bower install espacefine --save` si vous utilisez Bower (marche aussi avec npm). La version minifiée, recommandée pour des sites en production, se situe dans `dist/espacefine.min.js` ; la source complète et annotée se trouve dans le dossier `src`. Placez ce code dans votre page Web, de préférence juste avant de fermer `</body>` (pensez à corriger le chemin de `espacefine.min.js` si nécessaire) :

```html
<script type="text/javascript" src="espacefine/dist/espacefine.min.js"></script>
```

Ensuite appelez `espaceFine()` lorsque le DOM est prêt :
    
```html
<script type="text/javascript">
document.addEventListener("DOMContentLoaded", function(event) { 
    espaceFine();
});
</script>
```

(attention `DOMContentLoaded` ne marche pas sur les anciens navigateurs (IE <&nbsp;9), si vous utilisez jQuery il est plus judicieux de placer `espaceFine()` dans votre fonction `.ready()`, ou bien d'utiliser `window.onload`)

Et voilà, c'est tout ! Le script s'exécutera automatiquement, et dans tout votre page les espaces fines insécables seront ajoutées avant les ponctuations hautes ! : ? ; et à « l'intérieur des guillemets ». Le script omet volontairement le contenu des balises `code`, `pre` et `textarea` car les espaces doivent y être normales.
    
### Choix du sélecteur ###
    
Si vous ne souhaitez pas corriger toute la page, il vous suffit de passer un élément, NodeList ou sélecteur jQuery comme argument :
    
```js
// Ne s'applique qu'à un seul élément
espaceFine(document.getElementById("fine"));

// Ne s'applique qu'à certaines balises ou classes
espaceFine(document.getElementsByTagName("h1"));
espaceFine(document.getElementsByClassName("fine"));
    
// Avec un sélecteur jQuery : tous les paragraphes
// sauf ceux ayant une classe "normale"
var selecteur = $("p:not(.normale)");
espaceFine(selecteur);
```

### Modification du script ###

La fonction complète et annotée se situe dans le répertoire `src/`.
    
Le premier bloc commenté vous permet de comprendre l'expression régulière utilisée, et de la modifier selon vos besoins (pour ne pas s'appliquer à certaines ponctuations, par exemple). Si par exemple vous souhaitez omettre les guillemets, vous pouvez utiliser ceci:
    
```js
var regex = new RegExp(/(\u2014)(?:\s+)?|(?:\s+)?([\?!:;])/g),
```

Le deuxième bloc décrit la chaîne qui remplace les espaces normales, vous pouvez modifier le corps, y ajoindre une classe au lieu d'utiliser un style <em>inline</em> ou bien utiliser une espace Unicode réelle.

Le reste du script ne devrait pas avoir besoin d'être modifié.

## Et ensuite… ##

À faire…
* Plus de tests et améliorer la performance, pour une utilisation intensive.
* Simplifier la personnalisation des caractères ou de la chasse à utiliser, sans avoir à éditer la fonction soi-même
* Simplifier le fonctionnement avec AJAX

## Aller plus loin ##
    
* [fvsch](http://fvsch.com/code/espaces-unicode/)
* [DaScritch](http://dascritch.net/post/2011/05/09/Les-espacements-unicodes)
* [Typographisme](http://typographisme.net/post/Les-espaces-typographiques-et-le-web)

Je vous invite très vivement à remonter tout commentaire ou suggestion via GitHub ou sur Twitter (@DeadPx)

## Crédits & licence ##
    
L'algorithme de rechercher-remplacer en JS se base sur celui de [James Padolsey](http://james.padolsey.com/javascript/find-and-replace-text-with-javascript/).
    
espaceFine.js est écrit par Victor Loux. Il est sous licence WTFPL, c'est-à-dire dans le domaine public ; faites-en ce qu'il vous plaît.