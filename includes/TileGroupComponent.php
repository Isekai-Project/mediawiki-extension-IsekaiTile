<?php
namespace Isekai\Tile;

use Html;

class TileGroupComponent {
    private $content = '';
    private $size = [];
    private $title = false;
    private $attributes = [];
    private $classes = [];
    private $styles = [];

    public function __construct($args){
        $this->parseArgs($args);
    }

    public static function onParserSetup(\Parser $parser){
        $parser->setHook('tilegroup', self::class . '::onCreateTileGroupComponent');
    }

    public static function onCreateTileGroupComponent(string $text, array $args, \Parser $parser, \PPFrame $frame){
        $content = $parser->recursiveTagParse($text, $frame);

        $args['content'] = $content;

        $tileGroup = new TileGroupComponent($args);
        return [$tileGroup->getHtml(), "markerType" => 'nowiki'];
    }

    private function parseArgs($args){
        $allowedArgs = ['content', 'size', 'title', 'class', 'style'];

        if(isset($args['content'])){
            $this->content = $args['content'];
        }

        if(isset($args['size'])){
            $this->size = explode(' ', str_replace('size-', '', $args['size']));
        }

        if(isset($args['title'])){
            $this->title = $args['title'];
        }

        if(isset($args['class'])){
            $this->classes = explode(' ', $args['class']);
        }

        if(isset($args['style'])){
            $this->classes = explode(' ', $args['style']);
        }

        foreach($args as $name => $arg){
            if(!in_array($name, $allowedArgs) && substr($name, 0, 2) !== 'on'){
                $this->attributes[$name] = $arg;
            }
        }
    }

    private function getSizeArgs(array &$element){
        if(!empty($this->size)){
            $sizeAttr = [];
            foreach($this->size as $size){
                $sizeAttr[] = 'size-' . $size;
            }
            $element['class'] = array_merge($element['class'], $sizeAttr);
        }
    }

    private function getTitleArgs(array &$element){
        if($this->title){
            $element['data-group-title'] = $this->title;
        }
    }

    public function getHtml(){
        $element = array_merge($this->attributes, [
            'class' => array_merge($this->classes, ['tiles-grid', 'tiles-group']),
            'style' => $this->styles,
        ]);

        $this->getSizeArgs($element);
        $this->getTitleArgs($element);

        if(!empty($element['class'])){
            $element['class'] = implode(' ', $element['class']);
        } else {
            unset($element['class']);
        }
        if(!empty($element['style'])){
            $element['style'] = implode('; ', $element['style']) . ';';
        } else {
            unset($element['style']);
        }
        return Html::rawElement('div', $element, $this->content);
    }
}