import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../models/posts';


@Pipe({ name: 'filterpipe' })
export class FilterPipe implements PipeTransform {
  transform(allPosts: Post[],category: string) {

    if(allPosts === undefined || category === undefined) return;

    if(category == "0"){
      return allPosts;
    }

    return allPosts.filter(post => post.catid.toString() == category);
  }
}
