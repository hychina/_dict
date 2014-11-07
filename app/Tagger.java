import edu.stanford.nlp.tagger.maxent.MaxentTagger;

public class Tagger {
    private MaxentTagger tagger = new MaxentTagger(
        "../lib/stanford-postagger/models/english-bidirectional-distsim.tagger");
        
    public String tagString(String contextWords) {
        String tagged = tagger.tagString(contextWords);
        return tagged;
    }
}
