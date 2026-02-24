export default interface TreeNodeType {
    id: string;
    name: string;
    parentId: string | null;
    hasLoaded?: boolean;
    isLoading?: boolean;
}