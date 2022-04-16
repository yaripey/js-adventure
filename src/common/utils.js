export function colliding(a, b) {
    return (
        a.right > b.left
        && a.left < b.right
        && a.top < b.bottom
        && a.bottom > b.top
    )
}
