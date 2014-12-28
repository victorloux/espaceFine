
/**
 * Effectue un rechercher-remplacer pour ajouter des espaces fines avant les
 * signes doubles et à l'intérieur des guillemets.
 *
 * @see Basé sur un code de rechercher-remplacer par James Padolsey
 *      http://james.padolsey.com/javascript/find-and-replace-text-with-javascript/
 * @author Victor <hey@victorloux.fr>
 * @license http://www.wtfpl.net/txt/copying/ WTFPL version 2
 * @param  {node} searchNode Un élément HTML, ou une NodeList
*                            (p.ex. document.getElementsByClassName('fine'))
 * @return {void}
 */
function espaceFine(searchNode) {
    /**
     * Cette expression régulière est en deux parties (séparées par le 2e pipe)
     * 
     * Avant le pipe : (\u00AB|\u2014)(?:\s+)?
     *   - capturer soit un guillemet ouvrant (U+00AB) ou un tiret long (em dash,
     *     U+2014) dans la backreference $1
     *   - suivi par une ou plusieurs espaces, optionellement (?:\s+)?
     *   
     * Ou, si on ne trouve rien, après le pipe: (?:\s+)?([\?!:;\u00BB])
     *   - une ou plusieurs espaces, optionellement (?:\s+)?
     *   - puis capturer un signe double ? ! : ; ou bien un guillemet fermant
     *     (U+00BB) dans la backreference $2.
     *
     * Le métacaractère \s représente tout espace blanc (espace de n'importe
     * quelle largeur, tabulation, nouvelle ligne ou retour chariot)
     * Le modifieur /g est là pour capturer toutes les occurences dans le même
     * node de texte.
     *
     * Attention si vous supprimez la première partie la backreference $2
     * deviendra $1 et il vous faudra changer le remplacement ligne 128
     *
     * @type {RegExp}
     */
    var regex = new RegExp(/(\u00AB|\u2014)(?:\s+)?|(?:\s+)?([\?!:;\u00BB])/g),

    /**
     * La chaîne qui remplacera les espaces.
     * Par défaut un <span> avec un corps de 2/3 de cadratin.
     * 
     * Un réel caractère Unicode peut être utilisé (U+8239 NARROW NO-BREAK SPACE)
     * avec l'entité &#8239; mais attention, ce caractère ne fonctionne pas dans
     * tous les navigateurs, cf.
     *   http://fvsch.com/code/espaces-unicode/
     *   http://dascritch.net/post/2011/05/09/Les-espacements-unicodes
     *   http://typographisme.net/post/Les-espaces-typographiques-et-le-web
     * 
     * @type {String}
     */
        espace = '<span style="font-size: 0.67em">&nbsp;</span>',
        // espace = '&#8239;',

    /**
     * Liste de balises à exclure ; les éléments enfants seront traversés
     * mais le contenu direct (textNode) de ces éléments ne sera pas modifié.
     * Très important pour les balises meta, scripts et feuilles de style
     * mais aussi pour le contenu des balises <pre> ou <code>
     * 
     * @type {String}
     */
        balisesExclues = 'html,head,style,title,link,meta,script,object,iframe,pre,code,textarea,noscript';

    // Fin des paramètres

    if(!searchNode) searchNode = document.body; // Node par défaut si aucun param

    /**
     * Déclaration des variables internes
     * Explication des 3 dernières :
     * 
     * - _isNodeList est une expression qui détermine si l'argument reçu est un
     *   NodeList et pas un node unique. Expression un peu longue et complexe 
     *   mais au moins ça marche sous IE8+
     *   
     * - _nodes contient la liste des nodes à traverser. Expression ternaire:
     *   si searchNodes est un NodeList, alors l'utiliser directement
     *   sinon, prendre les enfants de searchNode
     *  
     * - _nodeIndex contient le nombre d'éléments dans childNodes et est réutilisé
     *   comme index à l'envers dans la boucle en dessous
     *   
     */

    var _nodes,
        _nodeActuel,
        _parent,
        _fragment,
        _isNodeList = (typeof searchNode === 'object' && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(searchNode)) && (Object.prototype.hasOwnProperty.call(searchNode, 'length') /* || 'length' in searchNode */) && (searchNode.length === 0 || (typeof searchNode[0] === "object" && searchNode[0].nodeType > 0))),
        _nodes = _isNodeList ? searchNode : searchNode.childNodes,
        _nodeIndex = _nodes.length;
        
    // var _nodes = [].slice.call(_nodesX, 0); 


    /**
     * Boucle qui passe dans chaque élément de _nodes
     */
    while (_nodeIndex--) {
        _nodeActuel = _nodes[_nodeIndex];

        // Évite un problème de récursion si searchNode est un sélecteur jQuery
        if(_nodeActuel == document.body) {
            continue;
        }

        if (_nodeActuel.nodeType === 1 && (balisesExclues + ',').indexOf(_nodeActuel.nodeName.toLowerCase() + ',') === -1) {
            arguments.callee(_nodeActuel);
        }

        // if (_nodeActuel.nodeType === 1 && (balisesExclues + ',').indexOf(_nodeActuel.nodeName.toLowerCase() + ',') === -1) {
        //     arguments.callee(_nodeActuel);
        // }

        // Si le node traversé n'est pas un node de texte, ou bien que la regex
        // de signe double ne trouve rien, ne rien faire et passer au node suivant
        if (_nodeActuel.nodeType !== 3 || !regex.test(_nodeActuel.data)) {
            continue;
        }


        // Sinon, remplacer l'espace normale & ajouter notre espace fine
        _parent = _nodeActuel.parentNode;
        _fragment = (function() {
            var html = _nodeActuel.data.replace(regex, "$1" + espace + "$2"),
                wrap = document.createElement('div'),
                frag = document.createDocumentFragment();
            wrap.innerHTML = html;
            while (wrap.firstChild) {
                frag.appendChild(wrap.firstChild);
            }
            return frag;
        })();

        _parent.insertBefore(_fragment, _nodeActuel);
        _parent.removeChild(_nodeActuel);
    }
}

